# Complete Solution: Google Sheets Empty Data Issue

## Executive Summary

Your form data isn't appearing in Google Sheets because of a **field mapping mismatch** between your Next.js form and Google Apps Script. The fixes provided address all root causes.

---

## What Was Wrong

### Issue 1: Missing Email & Name in Form ❌
**Your SupportForm.tsx captures:**
```typescript
requestType, summary, description, exactChange, additionalEmails, priority, impact
```

**Your Google Sheet expects:**
```
ID, Created On, Email, Name, Subject, Type of Request, ...
```

**Result:** Email and Name columns are empty because the form never collects them.

---

### Issue 2: Incorrect Field Mapping in Google Apps Script ❌
The `processCreateTicketFromJson()` function tried to extract fields that don't exist:

```javascript
// What you were doing:
'Email': data.email || data.requesterEmail || firstEmail || '', // data.email is undefined!
'Name': data.name || data.requesterName || '', // data.name is undefined!
'Subject': data.summary || data.subject || '', // ✓ Correct
'Request': data.description || data.request || '', // ✓ Correct
```

---

### Issue 3: No Debugging Visibility ❌
The original code had minimal logging, making it impossible to know where data was lost:
- No logs of form fields being received
- No logs of payload being sent
- No visibility into row building

---

## Solutions Applied

### ✅ Fix 1: Enhanced API Route with Detailed Logging

**File:** [app/api/support/route.ts](app/api/support/route.ts)

**Key improvements:**
- ✅ Logs all form fields when received
- ✅ Logs full payload before sending to Google Apps Script
- ✅ Logs response status and errors
- ✅ Debug mode: Add `?debug=true` to see what form sends

**Example debug request:**
```bash
POST /api/support?debug=true
```

**Debug response shows all form data captured:**
```json
{
  "success": true,
  "debug": true,
  "fields": {
    "requestType": "Bug Report",
    "summary": "Login broken",
    "description": "Cannot log in to system",
    "priority": "High",
    "exactChange": "",
    "additionalEmails": "supervisor@company.com",
    "impact": ""
  }
}
```

---

### ✅ Fix 2: Corrected Google Apps Script Function

**File:** [FIXED_processCreateTicketFromJson.gs](FIXED_processCreateTicketFromJson.gs)

**Key improvements:**
- ✅ Maps ONLY fields that actually come from Next.js
- ✅ Comprehensive logging at each step
- ✅ Converts row object to array in exact SHEET_HEADERS order
- ✅ Handles undefined values safely

**Critical section:**
```javascript
var rowArray = SHEET_HEADERS.map(function(headerName) {
  var value = rowObj[headerName];
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
});
sheet.appendRow(rowArray); // Append array, not object
```

---

### ✅ Fix 3: Comprehensive Debugging Guide

**File:** [DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md)

Covers:
- Root cause explanation
- Complete debug checklist
- How to enable debug mode
- How to read API logs
- How to read Google Apps Script logs
- Common issues and solutions

---

## Step-by-Step Implementation

### Step 1: Deploy Updated API Route
1. The file [app/api/support/route.ts](app/api/support/route.ts) has been updated with:
   - Enhanced logging (every step commented)
   - Field validation
   - Comprehensive error messages
   - Debug mode support

2. No additional changes needed - the code is backward compatible.

### Step 2: Replace Google Apps Script Function
1. Open your Google Apps Script project
2. Copy the entire `processCreateTicketFromJson()` function from [FIXED_processCreateTicketFromJson.gs](FIXED_processCreateTicketFromJson.gs)
3. Replace your existing function in Code.gs
4. Test by submitting a form

### Step 3: Optional - Add Email & Name to Form
If you want to capture email and name:

**In SupportForm.tsx, add:**
```tsx
import { Input } from "@/components/ui/Input";

// In your form JSX, add:
<Input 
  {...register("email")} 
  type="email"
  placeholder="your@email.com"
  required
/>

<Input 
  {...register("name")} 
  placeholder="Your Name"
  required
/>
```

**In supportSchema.ts, add:**
```typescript
export const supportSchema = z.object({
  // ... existing fields
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name is required"),
});
```

**In SupportForm.tsx onSubmit(), add:**
```typescript
formData.append("email", data.email);
formData.append("name", data.name);
```

### Step 4: Verify Google Sheet Headers Match
Check your Google Sheet's first row:
- If you have Email & Name columns but form doesn't capture them → Remove from SHEET_HEADERS in Code.gs
- If you added Email & Name to form → Ensure columns exist in sheet

**Example SHEET_HEADERS (minimal):**
```javascript
const SHEET_HEADERS = [
  'ID',
  'Created On',
  'Subject',          // Maps to data.summary
  'Type of Request',  // Maps to data.requestType
  'Request',          // Maps to data.description
  'Additional email addresses', // Maps to data.additionalEmails
  'Attachments',
  'Status',
  'Notes and Remarks'
];
```

---

## Testing the Fix

### Test 1: Debug Mode (No Data Storage)
```bash
# Test without storing data
POST /api/support?debug=true

# Form fields will echo back
```

### Test 2: Full Submission
```bash
# Submit normally
POST /api/support

# Check logs in this order:
1. Next.js dev server logs
2. Google Apps Script execution log
3. Google Sheet for new row
```

### Test 3: Verify Data Flow
1. **Next.js logs:**
   ```
   [INFO] Creating ticket TKT-...
   [INFO] Form data: { requestType: '...', summary: '...' }
   [INFO] Sending payload to Google Apps Script
   ```

2. **Google Apps Script logs:**
   ```
   START: processCreateTicketFromJson
   Row object built: { 'ID': '...', 'Subject': '...' }
   Row array (...): ['TKT-...', '2026-01-21...', 'Test Subject', ...]
   SUCCESS: Row appended
   ```

3. **Google Sheet:**
   - New row appears with data in correct columns

---

## Why This Happens

### Root Cause: Form ≠ Sheet Mismatch

```
Form Data             →  API Payload        →  Apps Script      →  Sheet
─────────────────        ──────────────        ──────────────       ─────
requestType             requestType         rowObj fields       SHEET_HEADERS
summary                 summary             map to...           columns
description             description         rowArray position   
priority                priority            
additionalEmails        additionalEmails    
(no email)              (no email)          → undefined → ''     Empty column!
(no name)               (no name)           → undefined → ''     Empty column!
```

**Fix:** Ensure every SHEET_HEADERS column either:
1. Maps to a form field (through Apps Script mapping), OR
2. Is removed from SHEET_HEADERS

---

## Verification Checklist

Before deploying to production:

- [ ] Run test with debug mode: `?debug=true`
- [ ] Verify all form fields appear in debug response
- [ ] Submit form normally and check Next.js logs
- [ ] Check Google Apps Script execution log
- [ ] Verify new row appears in Google Sheet
- [ ] Verify data is in correct columns (not shifted)
- [ ] Check file uploads to Google Drive
- [ ] Verify email notifications sent

---

## Bonus: Database-Style Validation

If you want extra safety, add this to your API route:

```typescript
// Validate all required fields before sending to Apps Script
const requiredFields = {
  requestType: requestType,
  summary: summary,
  description: description,
  priority: priority,
};

for (const [field, value] of Object.entries(requiredFields)) {
  if (!value || value.trim() === '') {
    throw new Error(`Required field "${field}" is empty`);
  }
}

console.log("[OK] All required fields present");
```

---

## Files Modified

| File | Change | Impact |
|------|--------|--------|
| [app/api/support/route.ts](app/api/support/route.ts) | Added comprehensive logging | 🟢 Can now debug form data flow |
| [FIXED_processCreateTicketFromJson.gs](FIXED_processCreateTicketFromJson.gs) | Corrected field mapping & logging | 🟢 Data now maps correctly to sheet |
| [DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md) | New debugging reference | 🟢 Can troubleshoot future issues |

---

## Common Mistakes to Avoid

❌ **Don't:** Assume data is being sent without checking logs
✅ **Do:** Check API logs with debug mode first

❌ **Don't:** Append to sheet without verifying row order
✅ **Do:** Convert object to array using SHEET_HEADERS.map()

❌ **Don't:** Mix form fields (e.g., send "requesterEmail" but Apps Script expects "email")
✅ **Do:** Standardize field names in form, API, and Apps Script

❌ **Don't:** Have more SHEET_HEADERS than actual columns in sheet
✅ **Do:** Keep SHEET_HEADERS synchronized with actual sheet structure

❌ **Don't:** Forget to handle undefined/null values
✅ **Do:** Convert everything to string: `String(value)`

---

## Next Steps

1. **Test the fix:**
   - Submit a test support request
   - Watch the Next.js logs
   - Check Google Apps Script execution log
   - Verify row appears in sheet with all data

2. **If data still missing:**
   - Follow the debugging guide step-by-step
   - Check which step data is lost
   - Report exact log messages

3. **Enhance form (optional):**
   - Add email & name capture if needed
   - Add validation for required fields
   - Add preview before submission

---

## Support

If you encounter issues:

1. **Check logs first** (Debug Guide covers all places to look)
2. **Search for your exact error** in DEBUGGING_GUIDE.md
3. **Use debug mode** to see what form sends
4. **Compare field names** between form, API, and Apps Script

The logging changes make it impossible to lose data invisibly - you'll always see exactly where it is.
