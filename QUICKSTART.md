# Quick Start Guide

Get the Enterprise Support System running in 10 minutes.

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Google Integration

### Create Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new sheet named "SupportRequests"
3. Copy the Sheet ID from URL

### Create Google Drive Folder
1. Go to [drive.google.com](https://drive.google.com)
2. Create a folder named "SupportRequests"
3. Copy the Folder ID from URL

### Deploy Apps Script
1. Open your Google Sheet
2. Extensions > Apps Script
3. Copy code from `google-apps-script/Code.gs`
4. Update `SHEET_ID`, `DRIVE_FOLDER_ID`, `ADMIN_EMAIL`
5. Deploy > New deployment > Web app
   - Execute as: **Me**
   - Access: **Anyone**
6. Copy the Web App URL

## 3. Configure Environment

Create `.env.local`:

```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
ADMIN_EMAIL=admin@yourcompany.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 4. Run the App

```bash
npm run dev
```

Visit: [http://localhost:3000/help-center](http://localhost:3000/help-center)

## 5. Test the System

1. Click on any support panel
2. Fill out the form
3. Attach a file (optional)
4. Submit
5. Check your email for confirmation
6. Check Google Sheet for the new row
7. Visit `/admin/support` to see the ticket
8. Update the status
9. Check email for status update

## Routes

- `/help-center` - Landing page
- `/support/it-admin` - IT Admin requests
- `/support/new-feature` - Feature requests
- `/support/enhancement` - Enhancement requests
- `/support/bug` - Bug reports
- `/admin/support` - Admin panel

## Troubleshooting

### Issue: "Failed to submit request"
- Check `GOOGLE_APPS_SCRIPT_URL` in `.env.local`
- Verify Apps Script is deployed
- Check browser console for errors

### Issue: No email received
- Check spam folder
- Verify `ADMIN_EMAIL` in Apps Script
- Check Apps Script execution logs

### Issue: Files not uploading
- Verify `DRIVE_FOLDER_ID` in Apps Script
- Check folder permissions
- Try smaller files first

### Issue: Tickets not showing in admin
- Verify Google Sheet has data
- Check API route is working: `/api/admin/support`
- Check browser console for errors

## Production Deployment

### Vercel
```bash
vercel
```

Add environment variables in Vercel dashboard.

### Other Platforms
```bash
npm run build
npm start
```

Ensure environment variables are set.

## Need Help?

See detailed docs:
- [README.md](README.md) - Full documentation
- [GOOGLE_APPS_SCRIPT_SETUP.md](GOOGLE_APPS_SCRIPT_SETUP.md) - Detailed Apps Script guide

---

**Happy coding! 🚀**
