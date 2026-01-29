# Debugging Guide: Google Sheets Empty Data Issue

## Root Causes Identified

### 1. **Missing Email & Name Fields** ❌
**Problem:** Your SupportForm captures 7 fields but doesn't collect user email or name.
```javascript
// Form sends these:
requestType, summary, description, exactChange, additionalEmails, priority, impact
// But Google Sheet expects:
ID, Created On, Email, Name, Subject, Type of Request, Status, etc.
```

**Why this breaks:** 
- Google Apps Script tries to map `data.email` → always `undefined`
- Google Apps Script tries to map `data.name` → always `undefined`
- Empty columns in your sheet

**Solution:** Either add email/name fields to your form OR ensure your Google Sheet only uses columns that have data.

---

### 2. **Field-to-Column Mapping Issues** 🔴
**Problem:** The `processCreateTicketFromJson` function in Code.gs uses:
```javascript
'Email': data.email || data.requesterEmail || firstEmail || '', // All undefined!
'Name': data.name || data.requesterName || '', // All undefined!
'Request': data.description || data.request || data.requestType || '', // OK
'Subject': data.summary || data.subject || '', // OK
```

Fields that work: `description`, `summary`, `priority`, `requestType`  
Fields that are empty: `email`, `name`, `company`, `department`, etc.

---

### 3. **Row Array vs Object Handling** 🟡
**Problem:** When `appendToSheet()` receives an array:
```javascript
function appendToSheet(ticketData) {
  // If caller passed an array already, append directly
  if (Array.isArray(ticketData)) {
    sheet.appendRow(ticketData);  // ← Skips mapping entirely!
    return;
  }
  // ... mapping code never runs
}
```

If an array is passed with missing values, it appends those missing values directly.

---

### 4. **No Debugging Visibility** 🔴
**Problem:** The original API route had minimal logging:
```javascript
// Original: only logs files count, not the actual payload
console.log("Submitting to /api/support, files count", files.length);

// Missing:
// - Form field values
// - Payload being sent to Google Apps Script
// - Response status details
// - Error details from Apps Script
```

Without logs, you can't see what's actually being sent.

---

## Complete Debug Checklist

### Step 1: Enable Debug Mode on Frontend ✅
Add `?debug=true` when testing:
```typescript
// In SupportForm.tsx onSubmit():
const debugMode = true; // Set to true for testing
const apiUrl = debugMode ? "/api/support?debug=true" : "/api/support";

const response = await fetch(apiUrl, {
  method: "POST",
  body: formData,
});
```

**What to look for:**
```json
{
  "success": true,
  "debug": true,
  "fields": {
    "requestType": "Bug Report",
    "summary": "Login page broken",
    "description": "Unable to login...",
    "priority": "High",
    "exactChange": "",
    "additionalEmails": "",
    "impact": ""
  },
  "files": [
    { "name": "screenshot.png", "size": 45632, "type": "image/png" }
  ]
}
```

✅ **Success indicators:**
- All form fields populated (not empty strings)
- Files array contains file objects
- No null or undefined values for required fields

❌ **Error indicators:**
- Empty strings where data should be
- Missing fields entirely
- Wrong field names

---

### Step 2: Check Next.js API Route Logs 🔍
**Location:** Your Next.js terminal where dev server is running

**Expected log output:**
```
[INFO] Creating ticket TKT-20260121-ABC123 at 2026-01-21T...
[INFO] Form data: {
  requestType: 'Bug Report',
  summary: 'Login page broken',
  priority: 'High',
  filesCount: 1
}
[INFO] Encoded file: screenshot.png
[INFO] Sending payload to Google Apps Script: {
  ticketId: 'TKT-20260121-ABC123',
  requestType: 'Bug Report',
  summary: 'Login page broken',
  filesCount: 1
}
[INFO] Google Apps Script response status: 200
[SUCCESS] Ticket created successfully: {
  ticketId: 'TKT-20260121-ABC123',
  gascResult: { success: true, ... }
}
```

**If you see:**
- ❌ `Missing required fields: ...` → Check form validation
- ❌ `GOOGLE_APPS_SCRIPT_URL is not configured` → Check .env.local
- ❌ `Google Apps Script returned 500:` → Issue in Google Apps Script
- ❌ Empty strings in payload → Form didn't capture values

---

### Step 3: Check Google Apps Script Logs 📊
**Location:** Google Apps Script Editor → Execution log

**To view logs:**
1. Open your Google Apps Script project
2. Click **Execution log** (bottom of editor)
3. Look for entries like:

```
[2026-01-21 10:30:45:123] Logger
Appending row for ticket: TKT-20260121-ABC123 -> 
{
  "ID": "TKT-20260121-ABC123",
  "Created On": "2026-01-21T10:30:45.123Z",
  "Email": "",
  "Name": "",
  "Subject": "Login page broken",
  "Type of Request": "Bug Report",
  "Status": "Open",
  ...
}
```

**Red flags:**
- ❌ `"Email": ""` and `"Name": ""` → Form doesn't collect these
- ❌ `"Subject": ""` → `summary` not passed to Apps Script
- ❌ `"Type of Request": ""` → `requestType` not passed
- ❌ Missing fields in the object → Field mapping broken

---

### Step 4: Verify Google Sheet Structure 📋
**Check your actual sheet headers:**

1. Open your Google Sheet
2. Look at Row 1 (headers)
3. Verify columns exist for your data:

```
A: ID
B: Created On
C: Email          ← Do you have this column?
D: Name           ← Do you have this column?
E: Subject        ← Maps to 'summary'
F: Type of Request ← Maps to 'requestType'
...
```

**Fix:** If you don't need email/name:
1. Remove those columns from `SHEET_HEADERS` array in Code.gs
2. Remove them from the `rowObj` mapping in `processCreateTicketFromJson`

---

### Step 5: Test with Minimal Data 🧪
Create a test script to verify data flow:

```typescript
// Test from browser console or create test.ts
async function testSupportAPI() {
  const formData = new FormData();
  formData.append("requestType", "Test");
  formData.append("summary", "Test Summary");
  formData.append("description", "Test Description");
  formData.append("priority", "Medium");
  formData.append("exactChange", "");
  formData.append("additionalEmails", "");
  formData.append("impact", "");

  const response = await fetch("/api/support?debug=true", {
    method: "POST",
    body: formData,
  });

  console.log(await response.json());
}

testSupportAPI();
```

Expected: All fields echo back in debug response.

---

### Step 6: Verify File Uploads 📁
**Check Google Drive:**

1. Open the Drive folder specified in `DRIVE_FOLDER_ID`
2. Look for folder named `TKT-20260121-ABC123`
3. Inside should be your uploaded files

**If missing:**
- ❌ `DRIVE_FOLDER_ID` configured incorrectly
- ❌ Permission issues
- ❌ No files being sent

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| All cells empty | Missing field mapping | Add fields to form, update mapping in Code.gs |
| Some cells empty | Undefined form values | Check form capture, verify field names match |
| Only headers visible | `appendToSheet()` receives empty array | Verify row building in `processCreateTicketFromJson` |
| Files not uploaded | Drive folder permission issue | Check `DRIVE_FOLDER_ID`, verify ownership |
| Google Apps Script errors | Malformed payload | Check JSON in API route logs |
| 500 error from API | Environment variable missing | Verify `GOOGLE_APPS_SCRIPT_URL` in .env.local |

---

## Best Practices Going Forward

### 1. **Always Log the Payload**
```typescript
console.log("[DEBUG] Final payload:", JSON.stringify(payload, null, 2));
```

### 2. **Validate Before Sending**
```typescript
if (!requestType || !summary || !description || !priority) {
  throw new Error("Missing required fields");
}
```

### 3. **Handle Errors Explicitly**
```typescript
if (!response.ok) {
  const text = await response.text();
  console.error("Apps Script failed:", text);
  // Show to user
}
```

### 4. **Test with ?debug=true First**
Always test in debug mode before production:
```
POST /api/support?debug=true
```

### 5. **Keep Column Order Consistent**
```javascript
// In Code.gs, always use this order:
const SHEET_HEADERS = ['ID', 'Created On', 'Email', 'Name', ...];
const rowArray = SHEET_HEADERS.map(h => rowObj[h] || '');
```

---

## Quick Troubleshooting Flow

```
Form submitted → 
  Check SupportForm logs ✓
    ↓
API route debug logs ✓
  Check /api/support?debug=true response
    ↓
Google Apps Script logs ✓
  Check Apps Script execution log
    ↓
Google Sheet ✓
  Verify row was added with correct data
```

If data missing at any step, fix that step before moving forward.
