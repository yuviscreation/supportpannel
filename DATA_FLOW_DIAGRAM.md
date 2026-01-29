# Data Flow Diagram & Field Mapping Reference

## Complete Data Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. FORM INPUT (SupportForm.tsx)                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ User enters data in form fields:                                        │
│ • requestType: "Bug Report"                                             │
│ • summary: "Login page broken"                                          │
│ • description: "Users cannot log in..."                                 │
│ • priority: "High"                                                      │
│ • exactChange: "" (optional)                                            │
│ • additionalEmails: "supervisor@company.com" (optional)                 │
│ • impact: "" (optional)                                                 │
│ • attachments: [file1.png, file2.pdf] (optional)                        │
└─────────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. FORM DATA SERIALIZATION (SupportForm.tsx)                            │
├─────────────────────────────────────────────────────────────────────────┤
│ Convert form data to FormData object:                                   │
│                                                                          │
│ const formData = new FormData();                                        │
│ formData.append("requestType", "Bug Report");                           │
│ formData.append("summary", "Login page broken");                        │
│ formData.append("description", "Users cannot log in...");               │
│ formData.append("priority", "High");                                    │
│ formData.append("exactChange", "");                                     │
│ formData.append("additionalEmails", "supervisor@company.com");          │
│ formData.append("impact", "");                                          │
│ files.forEach((file) => formData.append("attachments", file));          │
└─────────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. NEXT.JS API ROUTE (/api/support/route.ts)                            │
├─────────────────────────────────────────────────────────────────────────┤
│ POST request handler extracts form fields:                              │
│                                                                          │
│ const requestType = formData.get("requestType");  // "Bug Report"       │
│ const summary = formData.get("summary");          // "Login page..."    │
│ const description = formData.get("description");  // "Users cannot..."  │
│ const priority = formData.get("priority");        // "High"             │
│ const additionalEmails = formData.get("additionalEmails");              │
│ const files = formData.getAll("attachments");     // [file1, file2]     │
│                                                                          │
│ ✓ LOG: Displays all fields extracted                                    │
│ ✓ VALIDATE: Checks required fields not empty                            │
│ ✓ ENCODE: Converts files to base64                                      │
└─────────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. JSON PAYLOAD CONSTRUCTION (route.ts)                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ Build JSON payload for Google Apps Script:                              │
│                                                                          │
│ const payload = {                                                       │
│   action: "createTicket",                                               │
│   ticketId: "TKT-20260121-ABC123",                                      │
│   timestamp: "2026-01-21T10:30:45.123Z",                                │
│   requestType: "Bug Report",                                            │
│   summary: "Login page broken",                                         │
│   description: "Users cannot log in...",                                │
│   exactChange: "",                                                      │
│   additionalEmails: "supervisor@company.com",                           │
│   priority: "High",                                                     │
│   impact: "",                                                           │
│   status: "Open",                                                       │
│   files: [                                                              │
│     { filename: "bug.png", mimeType: "image/png", content: "base64..." }│
│   ]                                                                      │
│ };                                                                       │
│                                                                          │
│ ✓ LOG: Displays entire payload being sent                               │
│ ✓ VALIDATE: Ensures no required fields are undefined                    │
└─────────────────────────────────────────────────────────────────────────┘
                               ↓ HTTPS POST
┌─────────────────────────────────────────────────────────────────────────┐
│ 5. GOOGLE APPS SCRIPT - processCreateTicketFromJson()                   │
├─────────────────────────────────────────────────────────────────────────┤
│ Receives JSON payload from Next.js:                                     │
│ • Extracts data.requestType, data.summary, etc.                         │
│ • Decodes base64 files and uploads to Google Drive                      │
│ • Creates Drive folder: "TKT-20260121-ABC123/"                          │
│ • Generates file URLs for attachment links                              │
│                                                                          │
│ ✓ LOG: Shows all extracted fields                                       │
│ ✓ LOG: Shows file upload status                                         │
│ ✓ LOG: Shows row object being built                                     │
└─────────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ 6. ROW OBJECT MAPPING (Code.gs)                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ Map form fields to Google Sheet columns:                                │
│                                                                          │
│ var rowObj = {                                                          │
│   'ID': 'TKT-20260121-ABC123',                                          │
│   'Created On': '2026-01-21T10:30:45.123Z',                             │
│   'Email': '',                ← PROBLEM: Form doesn't capture email     │
│   'Name': '',                 ← PROBLEM: Form doesn't capture name      │
│   'Subject': 'Login page broken',  ← FROM: data.summary                 │
│   'Type of Request': 'Bug Report', ← FROM: data.requestType             │
│   'Request': 'Users cannot log in...', ← FROM: data.description         │
│   'Additional email addresses': 'supervisor@company.com',               │
│   'Attachments': 'https://drive.google.com/...', ← FROM: uploaded files │
│   'Status': 'Open',                                                     │
│   ...                                                                    │
│ };                                                                       │
│                                                                          │
│ ✓ CRITICAL: Every field maps to a SHEET_HEADERS column                  │
│ ✗ PROBLEM: Email & Name fields are empty                                │
└─────────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ 7. ROW ARRAY CONVERSION (Code.gs)                                       │
├─────────────────────────────────────────────────────────────────────────┤
│ Convert object to array in exact SHEET_HEADERS order:                   │
│                                                                          │
│ const SHEET_HEADERS = [                                                │
│   'ID',  (column A)                                                      │
│   'Created On',  (column B)                                              │
│   'Email',  (column C)                                                   │
│   'Name',  (column D)                                                    │
│   'Subject',  (column E)                                                 │
│   'Type of Request',  (column F)                                         │
│   ...                                                                    │
│ ];                                                                       │
│                                                                          │
│ const rowArray = [                                                      │
│   'TKT-20260121-ABC123',  ← Column A                                    │
│   '2026-01-21T10:30:45.123Z',  ← Column B                               │
│   '',  ← Column C (Email - EMPTY!)                                      │
│   '',  ← Column D (Name - EMPTY!)                                       │
│   'Login page broken',  ← Column E (Subject - OK!)                      │
│   'Bug Report',  ← Column F (Type of Request - OK!)                     │
│   ...                                                                    │
│ ];                                                                       │
│                                                                          │
│ ✓ LOG: Displays the entire row array                                    │
│ ✗ ISSUE: Empty values for Email & Name columns                          │
└─────────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ 8. GOOGLE SHEETS APPEND (Code.gs)                                       │
├─────────────────────────────────────────────────────────────────────────┤
│ Append row array to Google Sheet:                                       │
│                                                                          │
│ sheet.appendRow(rowArray);                                              │
│                                                                          │
│ Result in Google Sheet:                                                 │
│                                                                          │
│ Row 1 (Headers): ID | Created On | Email | Name | Subject | Type | ... │
│ Row 2 (Data):                                                           │
│   A: TKT-20260121-ABC123                                                │
│   B: 2026-01-21T10:30:45.123Z                                           │
│   C: (EMPTY)  ← No email captured                                       │
│   D: (EMPTY)  ← No name captured                                        │
│   E: Login page broken  ← Data here!                                    │
│   F: Bug Report  ← Data here!                                           │
│   ...                                                                    │
│                                                                          │
│ ✓ LOG: Confirms row appended successfully                               │
└─────────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ 9. VERIFICATION IN GOOGLE SHEET                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ ✓ Headers visible                                                       │
│ ✓ Data in columns E, F (Subject, Type)                                  │
│ ✗ Data missing in columns C, D (Email, Name)                            │
│ ✓ Attachment links in Attachments column                                │
│ ✓ Files uploaded to Google Drive                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Field Mapping Reference Table

| Next.js Form Field | API Payload Field | Google Sheet Column | Status |
|--------------------|-------------------|---------------------|--------|
| `requestType` | `data.requestType` | 'Type of Request' | ✅ Maps correctly |
| `summary` | `data.summary` | 'Subject' | ✅ Maps correctly |
| `description` | `data.description` | 'Request' | ✅ Maps correctly |
| `priority` | `data.priority` | (not in sheet currently) | ⚠️ Not stored |
| `exactChange` | `data.exactChange` | (not in sheet currently) | ⚠️ Not stored |
| `additionalEmails` | `data.additionalEmails` | 'Additional email addresses' | ✅ Maps correctly |
| `impact` | `data.impact` | (not in sheet currently) | ⚠️ Not stored |
| (NOT captured) | `data.email` | 'Email' | ❌ Always empty |
| (NOT captured) | `data.name` | 'Name' | ❌ Always empty |

---

## Problem Identification Flowchart

```
Form submitted
    ↓
[Q] Check Next.js logs - Do you see form data?
    ├─ NO → Form validation failed or JavaScript error
    │       Check SupportForm.tsx console for errors
    │
    └─ YES ↓
        [Q] Does payload show all fields?
        ├─ NO → Some fields not appended to FormData
        │       Check SupportForm.tsx onSubmit() - verify all appends
        │
        └─ YES ↓
            [Q] Check Google Apps Script logs - Was payload received?
            ├─ NO → Network error or wrong GOOGLE_APPS_SCRIPT_URL
            │       Verify environment variable & Apps Script deployed
            │
            └─ YES ↓
                [Q] Does "Row object" log show data?
                ├─ NO → Field mapping issue in processCreateTicketFromJson()
                │       Use FIXED_processCreateTicketFromJson.gs
                │
                └─ YES ↓
                    [Q] Does "Row array" log match expected order?
                    ├─ NO → SHEET_HEADERS order doesn't match actual sheet
                    │       Verify SHEET_HEADERS = actual sheet column order
                    │
                    └─ YES ↓
                        Data should be in Google Sheet!
                        ✓ Check sheet for new row
                        ✓ Verify data in correct columns
```

---

## Quick Diagnosis: Where's My Data?

### Data appears in Next.js logs but not in Google Sheet?
```
Form Data (Next.js) → ✓ Present
   ↓
Payload (API) → Check: Is it being sent to Apps Script?
   ↓
Apps Script Logs → Check: "Row object built" message
   ↓
Row Array → Check: Is it in correct column order?
   ↓
Google Sheet → Check: Are SHEET_HEADERS columns correct?
```

**Most Common Issues:**
1. **Empty Email/Name columns** → Form doesn't capture these (add them or remove columns)
2. **Data in wrong columns** → SHEET_HEADERS order doesn't match sheet
3. **No data at all** → Field mapping broken (use FIXED version)

---

## Example Correct Data Flow

### Input
```
Form:
- requestType: "Bug Report"
- summary: "Cannot login"
- description: "System won't accept password"
- priority: "High"
- additionalEmails: "admin@company.com"
```

### Processing
```
API Route extracts: ✓ All fields
API Route validates: ✓ No empty required fields
API Route encodes: ✓ Files to base64
API Route logs: ✓ Entire payload

Google Apps Script receives: ✓ Complete JSON
Google Apps Script uploads: ✓ Files to Drive
Google Apps Script maps: ✓ Fields to columns
Google Apps Script logs: ✓ Row object & row array
```

### Output
```
Google Sheet Row:
- Column A (ID): TKT-20260121-ABC123 ✓
- Column B (Created On): 2026-01-21T... ✓
- Column E (Subject): Cannot login ✓
- Column F (Type of Request): Bug Report ✓
- Column G (Additional emails): admin@company.com ✓
- Column H (Attachments): [links] ✓
```

---

## Testing Checklist with Expected Logs

### ✓ Test 1: Debug Mode
```bash
# Request
POST /api/support?debug=true
```

**Expected in browser console:**
```json
{
  "success": true,
  "debug": true,
  "fields": {
    "requestType": "Bug Report",
    "summary": "Cannot login",
    "description": "System won't accept password",
    "priority": "High"
  }
}
```

### ✓ Test 2: Next.js API Logs
**Expected in terminal:**
```
[INFO] Creating ticket TKT-... at 2026-01-21T...
[INFO] Form data: { requestType: 'Bug Report', summary: 'Cannot login', ... }
[INFO] Sending payload to Google Apps Script
[SUCCESS] Ticket created successfully
```

### ✓ Test 3: Google Apps Script Logs
**Expected in Apps Script execution log:**
```
START: processCreateTicketFromJson
Row object built: { 'ID': 'TKT-...', 'Subject': 'Cannot login', ... }
Row array (...): ['TKT-...', '2026-01-21...', 'Cannot login', 'Bug Report', ...]
SUCCESS: Row appended for ticket TKT-...
```

### ✓ Test 4: Google Sheet
**Expected to see:**
- New row in sheet
- Data in columns mapped from form
- Empty cells only for fields form doesn't capture

---

## Real Example: Step-by-Step

### 1. User Submits Form
```
"I want to report a bug"
Summary: "Login button doesn't work"
Description: "The login button on the home page is not clickable"
Priority: "High"
Files: screenshot.png
```

### 2. Next.js Log Output
```
[INFO] Creating ticket TKT-20260121-XYZ789 at 2026-01-21T10:35:22.456Z
[INFO] Form data: {
  requestType: 'Bug Report',
  summary: 'Login button doesn\'t work',
  priority: 'High',
  filesCount: 1
}
[INFO] Encoded file: screenshot.png
[INFO] Sending payload to Google Apps Script
[SUCCESS] Ticket created successfully: {
  ticketId: 'TKT-20260121-XYZ789'
}
```

### 3. Google Apps Script Log Output
```
START: processCreateTicketFromJson
Received payload keys: action,ticketId,timestamp,requestType,summary,description,...
Creating Drive folder for ticket: TKT-20260121-XYZ789
Processing 1 files
Uploading file: screenshot.png
File uploaded: screenshot.png → https://drive.google.com/file/d/...
Row object built: {
  "ID": "TKT-20260121-XYZ789",
  "Created On": "2026-01-21T10:35:22.456Z",
  "Subject": "Login button doesn't work",
  "Type of Request": "Bug Report",
  "Request": "The login button on the home page is not clickable",
  "Attachments": "https://drive.google.com/file/d/..."
}
Row array (25): ["TKT-20260121-XYZ789","2026-01-21T10:35:22.456Z","","","","","","","","Login button doesn't work","Bug Report",...,"Open",""]
SUCCESS: Row appended for ticket TKT-20260121-XYZ789
```

### 4. Google Sheet Result
| ID | Created On | Email | Name | Subject | Type of Request | Request | Attachments |
|----|------------|-------|------|---------|-----------------|---------|-------------|
| TKT-20260121-XYZ789 | 2026-01-21T... | | | Login button doesn't work | Bug Report | The login button... | [link] |

✓ **Data is there!** (Email & Name are empty because form doesn't capture them)
