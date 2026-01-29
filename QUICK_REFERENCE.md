# Quick Reference: Google Sheets Integration Fix

## The Problem (One-Liner)
Your form doesn't capture email/name, but Google Sheet expects them → columns appear empty.

---

## The Solution (Three Steps)

### 1️⃣ Update API Route
✅ **DONE** - File updated: [app/api/support/route.ts](app/api/support/route.ts)
- Added detailed logging
- Added validation
- Support for debug mode (`?debug=true`)

### 2️⃣ Update Google Apps Script
⏳ **TODO** - Copy function to your Google Apps Script:
1. Open your Google Apps Script project
2. Find `processCreateTicketFromJson()` function
3. Replace it with code from: [FIXED_processCreateTicketFromJson.gs](FIXED_processCreateTicketFromJson.gs)
4. Save and deploy

### 3️⃣ Verify & Test
1. Submit a test form
2. Check logs (see [DEBUG COMMANDS](#debug-commands) below)
3. Verify data appears in Google Sheet

---

## Debug Commands

### Test Debug Mode (No Data Storage)
```bash
# Option 1: In browser console
fetch('/api/support?debug=true', {
  method: 'POST',
  body: new FormData(document.querySelector('form'))
}).then(r => r.json()).then(d => console.log(d))

# Option 2: With curl
curl -X POST 'http://localhost:3000/api/support?debug=true' \
  -F "requestType=Bug" \
  -F "summary=Test" \
  -F "description=Test Description" \
  -F "priority=High"
```

**Expected Response:**
```json
{
  "success": true,
  "debug": true,
  "fields": { /* all your form data */ }
}
```

---

## Viewing Logs

### Next.js API Logs
```
Location: Terminal where you ran `npm run dev`
Search for: [INFO], [ERROR], [SUCCESS]
Shows: Form fields received, payload sent, response status
```

### Google Apps Script Logs
```
Location: Google Apps Script Editor → Execution log
Search for: "Row array", "Row object", "SUCCESS"
Shows: Data being mapped and appended to sheet
```

### Google Sheet Verification
```
1. Open your Google Sheet
2. Look for new row (usually at bottom)
3. Check data is in correct columns
4. Empty Email/Name columns = form doesn't capture them (EXPECTED)
```

---

## Common Fixes

| Issue | Fix |
|-------|-----|
| **Empty Email & Name columns** | Form doesn't capture these. Either add them to form or remove columns from `SHEET_HEADERS` |
| **Data in wrong columns** | Verify `SHEET_HEADERS` order matches your actual sheet columns |
| **No data at all** | Use corrected `processCreateTicketFromJson` from FIXED file |
| **Files not uploaded** | Check `DRIVE_FOLDER_ID` in Code.gs and folder permissions |
| **500 error from API** | Check `.env.local` has `GOOGLE_APPS_SCRIPT_URL` |

---

## Optional: Add Email & Name to Form

**If you want to capture email and name:**

**File:** `lib/validation/supportSchema.ts`
```typescript
export const supportSchema = z.object({
  requestType: z.string().min(1, "Request type is required"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().min(10, "Description required"),
  email: z.string().email("Valid email required"),  // ADD THIS
  name: z.string().min(1, "Name required"),  // ADD THIS
  // ... rest of fields
});
```

**File:** `components/support/SupportForm.tsx`
```tsx
// In the JSX, add these inputs:
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

// In onSubmit(), add these appends:
formData.append("email", data.email);
formData.append("name", data.name);
```

---

## Field Mapping Cheat Sheet

```
Form Field Name     →  Google Sheet Column
─────────────────────────────────────────
requestType         →  'Type of Request'
summary             →  'Subject'
description         →  'Request'
additionalEmails    →  'Additional email addresses'
priority            →  (not stored currently)
exactChange         →  (not stored currently)
impact              →  (not stored currently)
```

---

## Testing Workflow

```
1. Submit Form
   ↓
2. Check Next.js logs for: [INFO] Form data: { ... }
   ↓
   ✗ Missing fields? → Check form capture
   ✓ All fields present? → Continue
   ↓
3. Check Apps Script logs for: "Row array (...):"
   ↓
   ✗ Sees errors? → Fix field mapping
   ✓ Row array complete? → Continue
   ↓
4. Check Google Sheet for new row
   ↓
   ✗ No row? → Check Apps Script permissions
   ✓ Row present? → SUCCESS!
```

---

## Files Reference

| File | Purpose |
|------|---------|
| [app/api/support/route.ts](app/api/support/route.ts) | ✅ Fixed - Enhanced API with logging |
| [FIXED_processCreateTicketFromJson.gs](FIXED_processCreateTicketFromJson.gs) | 📋 Copy this to your Google Apps Script |
| [SOLUTION_SUMMARY.md](SOLUTION_SUMMARY.md) | 📖 Full explanation of the issue |
| [DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md) | 🔧 Detailed debugging steps |
| [DATA_FLOW_DIAGRAM.md](DATA_FLOW_DIAGRAM.md) | 📊 Visual data flow & field mapping |

---

## One-Minute Quick Start

### If data is missing:
1. ✅ API route updated? Done!
2. ✅ Google Apps Script updated? Copy from FIXED file
3. ✅ Run test with `?debug=true`
4. ✅ Check Next.js logs - see form fields?
5. ✅ Check Apps Script logs - see row array?
6. ✅ Check Sheet - see new row?

### If still broken:
→ Follow [DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md) step-by-step

---

## Root Cause Reminder

Your form only sends 7 fields:
```javascript
requestType, summary, description, exactChange, additionalEmails, priority, impact
```

But your Google Sheet might have columns for:
```javascript
email, name, company, department, etc. (that form never sends)
```

**Result:** Those columns are empty

**Fix:** Either add those fields to form OR remove those columns from `SHEET_HEADERS`

---

## Success Criteria

✅ Form submitted successfully
✅ New row appears in Google Sheet
✅ Data visible in mapped columns (Subject, Type of Request, etc.)
✅ Email/Name columns empty (if form doesn't capture them) - **THIS IS NORMAL**
✅ Files uploaded to Google Drive (if attachments included)
✅ Email notifications sent

---

## Still Stuck?

1. **Enable debug mode:** Add `?debug=true` to API request
2. **Check all three logs:** Browser → API → Google Apps Script → Sheet
3. **Find where data is lost:** One of the steps will show the problem
4. **Reference the full guide:** [DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md)

---

## Key Insights

| Concept | Important |
|---------|-----------|
| **Form fields** | Only these 7 go to Google Sheets (+ attachments) |
| **Field mapping** | Form field → API field → Apps Script field → Sheet column |
| **Empty columns** | Expected if form doesn't capture that field |
| **Array order** | Row array must match SHEET_HEADERS order exactly |
| **Logging** | Check logs at each step to find where data is lost |

---

## Before Deploying to Production

- [ ] Test with debug mode works
- [ ] Test normal submission works
- [ ] Verify data in Google Sheet
- [ ] Verify files in Google Drive
- [ ] Verify emails received
- [ ] Check no sensitive data in logs
- [ ] Remove debug-only code if needed
