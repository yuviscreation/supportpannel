# Enterprise Support Request System

A complete enterprise-grade Help Center and Support Request Management System built with Next.js 14, TypeScript, and Google Apps Script integration.

## 🎯 Features

- **Help Center Landing Page** - Professional UI with 4 support categories
- **Four Support Request Types**:
  - IT Admin / Data Correction Requests
  - New Feature Request
  - Change / Enhancement Request
  - Bug Report
- **Admin Panel** - View and manage all tickets with status updates
- **Google Sheets Integration** - All tickets stored in Google Sheets
- **Google Drive Integration** - File attachments uploaded automatically
- **Email Automation** - Automated notifications on ticket creation and status updates
- **Responsive Design** - Works on all devices
- **Type-Safe** - Full TypeScript support
- **Production Ready** - Scalable architecture

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Hook Form**
- **Zod Validation**
- **Lucide Icons**

### Backend
- **Next.js API Routes**
- **Google Apps Script**
- **Google Sheets API**
- **Google Drive API**
- **Gmail (MailApp)**

## 📁 Project Structure

```
supportpannel/
├── app/
│   ├── help-center/          # Landing page
│   │   └── page.tsx
│   ├── support/              # Support request pages
│   │   ├── it-admin/
│   │   ├── new-feature/
│   │   ├── enhancement/
│   │   └── bug/
│   ├── admin/                # Admin panel
│   │   └── support/
│   ├── api/                  # API routes
│   │   ├── support/
│   │   └── admin/support/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Card.tsx
│   │   ├── Table.tsx
│   │   └── Badge.tsx
│   ├── support/              # Support form components
│   │   ├── SupportForm.tsx
│   │   ├── AttachmentDropzone.tsx
│   │   └── PriorityRadioGroup.tsx
│   ├── help-center/          # Help center components
│   │   ├── HelpCenterBanner.tsx
│   │   └── SupportPanelCard.tsx
│   └── admin/                # Admin components
│       ├── SupportTable.tsx
│       └── StatusDropdown.tsx
├── lib/
│   ├── validation/
│   │   └── supportSchema.ts
│   └── utils.ts
├── types/
│   ├── support.ts
│   └── admin.ts
├── google-apps-script/
│   └── Code.gs               # Google Apps Script code
└── package.json
```

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd supportpannel
npm install
```

### 2. Set Up Google Apps Script

#### Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "SupportRequests"
3. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

#### Create Google Drive Folder
1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder named "SupportRequests"
3. Copy the Folder ID from the URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
   ```

#### Deploy Google Apps Script
1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Delete any default code
4. Copy the entire contents of `google-apps-script/Code.gs`
5. Update these constants at the top of the file:
   ```javascript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
   const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID_HERE';
   const ADMIN_EMAIL = 'admin@yourcompany.com';
   ```
6. **Deploy as Web App**:
   - Click **Deploy > New deployment**
   - Click the gear icon ⚙️ next to "Select type"
   - Choose **Web app**
   - Settings:
     - Description: "Support System API"
     - Execute as: **Me**
     - Who has access: **Anyone**
   - Click **Deploy**
   - **Authorize** the script (review permissions)
   - Copy the **Web app URL**

### 3. Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your values:
   ```env
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ADMIN_EMAIL=admin@yourcompany.com
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

### 4. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000/help-center](http://localhost:3000/help-center)

## 📋 Usage

### User Flow

1. **Visit Help Center** - Navigate to `/help-center`
2. **Select Request Type** - Click on one of the 4 support panels
3. **Fill Form** - Complete the support request form
4. **Attach Files** - Drag & drop files (optional)
5. **Submit** - Receive ticket ID confirmation
6. **Email Confirmation** - Automatic email sent with ticket details

### Admin Flow

1. **Access Admin Panel** - Navigate to `/admin/support`
2. **View All Tickets** - See all support requests in a table
3. **Update Status** - Change ticket status (Open → In Progress → Done)
4. **Auto Notification** - Users receive email on status change

## 🎨 Routes

| Route | Description |
|-------|-------------|
| `/help-center` | Main landing page with 4 support panels |
| `/support/it-admin` | IT Admin / Data Correction Requests |
| `/support/new-feature` | New Feature Request form |
| `/support/enhancement` | Change / Enhancement Request form |
| `/support/bug` | Bug Report form |
| `/admin/support` | Admin panel to manage tickets |

## 📧 Email Notifications

### Ticket Creation Email
- Sent to: Requester + Additional Emails + Admin
- Contains: Ticket ID, Summary, Priority, Status, Attachments

### Status Update Email
- Sent to: Requester + Additional Emails
- Contains: Ticket ID, New Status, Update Timestamp

## 🗃️ Google Sheet Structure

| Column | Description |
|--------|-------------|
| TicketId | Unique ticket identifier (TKT-xxxxx-xxxx) |
| Timestamp | ISO timestamp of creation |
| RequestType | Type of support request |
| Summary | Brief description |
| Description | Detailed description |
| ExactChange | Current → New value |
| AdditionalEmails | CC recipients |
| Priority | Critical / High / Medium / Low |
| Impact | Impact description |
| AttachmentLinks | Google Drive file URLs |
| Status | Open / In Progress / Done |
| ApprovedBy | Admin who approved |
| ApprovedAt | Approval timestamp |

## 🔧 Google Apps Script Functions

### Core Functions
- `doGet()` - Handle GET requests (fetch tickets)
- `doPost()` - Handle POST requests (create/update tickets)
- `initializeSheet()` - Initialize sheet with headers
- `appendToSheet()` - Add new ticket to sheet
- `getAllTickets()` - Retrieve all tickets
- `updateTicketStatus()` - Update ticket status
- `handleFileUploads()` - Upload files to Drive
- `sendTicketCreationEmail()` - Send creation notification
- `sendStatusUpdateEmail()` - Send status update notification

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables:
   - `GOOGLE_APPS_SCRIPT_URL`
   - `ADMIN_EMAIL`
   - `NEXT_PUBLIC_BASE_URL`
4. Deploy

### Update Google Apps Script URL
After deployment, update `.env.local` with production URL for email links.

## 🔐 Security Notes

- Google Apps Script is deployed as "Anyone" access for API functionality
- All file uploads are stored in Google Drive with view-only permissions
- No authentication is implemented (add as needed)
- Rate limiting should be implemented for production

## 🎯 Future Enhancements

- [ ] User authentication (OAuth)
- [ ] File type restrictions
- [ ] Advanced search and filtering
- [ ] Ticket comments/replies
- [ ] SLA tracking
- [ ] Dashboard analytics
- [ ] Export to PDF
- [ ] Webhook integrations
- [ ] Mobile app

## 📝 License

MIT License - feel free to use for any purpose

## 🤝 Support

For issues or questions, create a ticket using the system! 😄

---

**Built with ❤️ using Next.js 14 and Google Apps Script**
