# Google Apps Script Setup Guide

Complete step-by-step guide to set up Google Apps Script for the Support System.

## Prerequisites

- Google Account
- Access to Google Sheets, Drive, and Gmail

## Step 1: Create Google Sheet

1. Go to [https://sheets.google.com](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Rename it to **"SupportRequests"**
4. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
   ```
5. Save this ID for later

## Step 2: Create Google Drive Folder

1. Go to [https://drive.google.com](https://drive.google.com)
2. Click **+ New > Folder**
3. Name it **"SupportRequests"**
4. Open the folder and copy the **Folder ID** from the URL:
   ```
   https://drive.google.com/drive/folders/COPY_THIS_PART
   ```
5. Save this ID for later

## Step 3: Open Apps Script Editor

1. Open your "SupportRequests" Google Sheet
2. Click **Extensions > Apps Script**
3. You'll see a new tab with the Apps Script editor
4. Delete any existing code in the editor

## Step 4: Add the Script Code

1. Open the file `google-apps-script/Code.gs` from this project
2. Copy the entire contents
3. Paste it into the Apps Script editor

## Step 5: Configure Constants

At the top of the script, update these three values:

```javascript
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // From Step 1
const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID_HERE'; // From Step 2
const ADMIN_EMAIL = 'admin@yourcompany.com'; // Your admin email
```

Example:
```javascript
const SHEET_ID = '1ABC-xYz123_ExampleSheetId789';
const DRIVE_FOLDER_ID = '1XYZ-aBc456_ExampleFolderId321';
const ADMIN_EMAIL = 'admin@mycompany.com';
```

## Step 6: Save the Project

1. Click the **disk icon** or press `Ctrl+S` (Windows) / `Cmd+S` (Mac)
2. Name your project: **"Support System API"**
3. Click **OK**

## Step 7: Deploy as Web App

1. Click **Deploy > New deployment**
2. Click the **gear icon** ⚙️ next to "Select type"
3. Choose **Web app**
4. Fill in the deployment settings:
   - **Description**: "Support System API v1"
   - **Execute as**: **Me (your@email.com)**
   - **Who has access**: **Anyone**
5. Click **Deploy**

## Step 8: Authorize Permissions

1. You'll see a dialog: **"Authorization required"**
2. Click **Authorize access**
3. Choose your Google account
4. You may see a warning: **"Google hasn't verified this app"**
   - Click **Advanced**
   - Click **Go to [Project Name] (unsafe)**
   - This is safe because you created the script
5. Review the permissions:
   - View and manage spreadsheets
   - View and manage files in Drive
   - Send email as you
6. Click **Allow**

## Step 9: Copy the Web App URL

1. After authorization, you'll see:
   ```
   Web app URL: https://script.google.com/macros/s/ABC123.../exec
   ```
2. **Copy this entire URL**
3. Save it for the next step

## Step 10: Test the Deployment

### Test with a simple GET request:

Open a new browser tab and paste:
```
YOUR_WEB_APP_URL?action=getTickets
```

You should see:
```json
{
  "success": true,
  "tickets": []
}
```

If you see an error, check:
- Sheet ID is correct
- Folder ID is correct
- Permissions were granted

## Step 11: Update Next.js Environment

1. Open your project's `.env.local` file
2. Add the Web App URL:
   ```env
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ADMIN_EMAIL=admin@yourcompany.com
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

## Step 12: Restart Next.js Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

## Troubleshooting

### Error: "Cannot find spreadsheet"
- Double-check the `SHEET_ID` constant
- Ensure you have edit access to the sheet

### Error: "Cannot find folder"
- Double-check the `DRIVE_FOLDER_ID` constant
- Ensure the folder exists and you have write access

### Error: "Authorization required"
- Re-deploy the script
- Go through authorization again
- Make sure "Execute as: Me" is selected

### Emails not sending
- Check `ADMIN_EMAIL` is correct
- Verify Gmail is enabled in your Google account
- Check spam folder

### Files not uploading
- Verify `DRIVE_FOLDER_ID` is correct
- Check folder permissions
- Ensure folder is not in Trash

## Updating the Script

If you need to update the script later:

1. Make changes in the Apps Script editor
2. Save the file (`Ctrl+S` / `Cmd+S`)
3. Click **Deploy > Manage deployments**
4. Click the **pencil icon** ✏️ next to your deployment
5. Change **Version** to **New version**
6. Add a description (e.g., "Bug fixes")
7. Click **Deploy**

**Important**: The Web App URL stays the same!

## Security Best Practices

1. **Never commit** your Sheet ID or Folder ID to public repositories
2. Use **environment variables** for sensitive data
3. Consider adding **authentication** for production use
4. Regularly **review script permissions**
5. Monitor **execution logs** in Apps Script

## View Execution Logs

1. In Apps Script editor, click **Executions** (clock icon)
2. See all script runs with status and errors
3. Click any execution to see detailed logs

## Common Questions

### Q: Why "Anyone" access?
**A**: The script acts as an API endpoint. Next.js server makes requests to it. No user authentication is passed, so "Anyone" is required.

### Q: Is my data secure?
**A**: Data is stored in your Google Sheet and Drive. Only you have edit access. The script runs with your permissions.

### Q: Can I add authentication?
**A**: Yes! You can add API keys or OAuth. Check Google's Apps Script documentation for details.

### Q: How many requests can I make?
**A**: Free tier: ~20,000 URL Fetch calls per day. See [Google Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas).

---

**You're all set! 🎉**

Test by submitting a support request in your Next.js app.
