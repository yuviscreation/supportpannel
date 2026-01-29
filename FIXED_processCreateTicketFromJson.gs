/**
 * CORRECTED: processCreateTicketFromJson() - Fixed Version
 * 
 * This is the EXACT function that should replace the one in your Code.gs
 * The key fixes:
 * 1. Properly maps form fields that ACTUALLY come from Next.js
 * 2. Adds comprehensive logging for debugging
 * 3. Handles undefined values safely
 * 4. Ensures row array matches SHEET_HEADERS order exactly
 */

/**
 * Process createTicket payload sent as JSON from Next.js API route
 * Files are base64 encoded. This function:
 * 1. Uploads files to Google Drive
 * 2. Builds a row array matching SHEET_HEADERS order
 * 3. Appends row to the Google Sheet
 * 4. Sends notifications
 * 
 * @param {Object} data - The JSON payload from /api/support route
 */
function processCreateTicketFromJson(data) {
  Logger.log('='.repeat(80));
  Logger.log('START: processCreateTicketFromJson');
  Logger.log('Received payload keys:', Object.keys(data));

  // ==================== STEP 1: UPLOAD FILES TO GOOGLE DRIVE ====================
  var attachmentLinks = '';
  try {
    var parentFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    var ticketId = data.ticketId || generateTicketId();

    Logger.log('Creating Drive folder for ticket:', ticketId);

    // Create or use existing folder for this ticket
    var folderIterator = parentFolder.getFoldersByName(ticketId);
    var ticketFolder = folderIterator.hasNext() 
      ? folderIterator.next() 
      : parentFolder.createFolder(ticketId);

    var fileLinks = [];
    if (data.files && Array.isArray(data.files) && data.files.length > 0) {
      Logger.log('Processing', data.files.length, 'files');

      for (var i = 0; i < data.files.length; i++) {
        var f = data.files[i];
        try {
          Logger.log('Uploading file:', f.filename);

          var blob = Utilities.newBlob(
            Utilities.base64Decode(f.content),
            f.mimeType || 'application/octet-stream',
            f.filename || ('attachment_' + i)
          );

          var file = ticketFolder.createFile(blob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

          var fileUrl = file.getUrl();
          fileLinks.push(fileUrl);

          Logger.log('File uploaded:', f.filename, '→', fileUrl);
        } catch (uploadErr) {
          Logger.log('ERROR uploading file:', f.filename, uploadErr.toString());
        }
      }

      attachmentLinks = fileLinks.join(', ');
      Logger.log('Final attachment links:', attachmentLinks);
    } else {
      Logger.log('No files to upload');
    }
  } catch (err) {
    Logger.log('ERROR in file upload section:', err.toString());
    attachmentLinks = '';
  }

  // ==================== STEP 2: BUILD ROW OBJECT MAPPING ====================
  // This is the CRITICAL part. Map ONLY the fields that Next.js actually sends.
  // See your SupportForm.tsx to understand what's captured.
  
  var ticketIdFinal = data.ticketId || generateTicketId();
  var createdOn = data.timestamp || new Date().toISOString();

  // IMPORTANT: Your form doesn't capture email or name, so these will be empty
  // unless you add them to SupportForm.tsx
  var firstEmail = '';
  if (data.additionalEmails && typeof data.additionalEmails === 'string') {
    try {
      var emailsArray = data.additionalEmails.split(',');
      firstEmail = emailsArray[0].trim();
    } catch (e) {
      Logger.log('Error parsing additional emails:', e.toString());
      firstEmail = '';
    }
  }

  // Build the object mapping SHEET_HEADERS to data
  // For fields not in the payload, use empty string ''
  var rowObj = {
    'ID': ticketIdFinal,
    'Created On': createdOn,
    'Start time': data.startTime || '',
    'Email': data.email || data.requesterEmail || firstEmail || '', // Will be empty unless form captures it
    'Name': data.name || data.requesterName || '', // Will be empty unless form captures it
    'Request': data.description || data.request || '', // From 'description' field
    'Additional email addresses': data.additionalEmails || '', // From form
    'Attachments': attachmentLinks, // Links to Drive files
    'Context': data.context || '', // Not in form
    'Subject': data.summary || data.subject || '', // From 'summary' field
    'Type of Request': data.requestType || data.typeOfRequest || '', // From form
    'Company': data.company || '', // Not in form
    'Department': data.department || '', // Not in form
    'Working on this Request': data.workingOnThisRequest || '', // Not in form
    'Approving this Request': data.approvingThisRequest || '', // Not in form
    'Project Plan (if applicable)': data.projectPlan || '', // Not in form
    'Actions (that need to be taken to complete this Request)': data.actions || data.actionsNeeded || '', // Not in form
    'Start Date': data.startDate || '', // Not in form
    'Initial Due Date': data.initialDueDate || '', // Not in form
    'Current Due Date': data.currentDueDate || '', // Not in form
    'Completion Date': data.completionDate || '', // Not in form
    'Deployment Date (if applicable)': data.deploymentDate || '', // Not in form
    'Status': data.status || 'Open', // Defaults to 'Open'
    'Notes and Remarks': data.notes || data.remarks || '', // Not in form
    'Internal': data.internal || '' // Not in form
  };

  Logger.log('Row object built:', JSON.stringify(rowObj));

  // ==================== STEP 3: CONVERT OBJECT TO ARRAY IN EXACT HEADER ORDER ====================
  // THIS IS CRITICAL! The array must be in the exact same order as SHEET_HEADERS
  var rowArray = SHEET_HEADERS.map(function(headerName) {
    var value = rowObj[headerName];
    
    // Convert undefined/null to empty string
    if (value === undefined || value === null) {
      return '';
    }
    
    // Convert to string
    return String(value);
  });

  Logger.log('Row array (', rowArray.length, 'values):', rowArray);

  // ==================== STEP 4: APPEND TO GOOGLE SHEET ====================
  try {
    var sheet = initializeSheet();
    
    // Append the row array (NOT an object)
    // This ensures data goes into the correct columns
    sheet.appendRow(rowArray);

    Logger.log('SUCCESS: Row appended for ticket', ticketIdFinal);
  } catch (sheetErr) {
    Logger.log('ERROR appending to sheet:', sheetErr.toString());
    throw sheetErr;
  }

  // ==================== STEP 5: SEND EMAIL NOTIFICATIONS ====================
  try {
    // Email to requester (from additional emails if provided)
    if (data.additionalEmails) {
      var subject = 'Support Request Created - ' + ticketIdFinal;
      var body = buildTicketEmailBody(rowObj, attachmentLinks);

      MailApp.sendEmail({
        to: data.additionalEmails,
        subject: subject,
        body: body,
        name: 'Support System'
      });

      Logger.log('Notification email sent to:', data.additionalEmails);
    }

    // Email to admin
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: 'New Support Request - ' + ticketIdFinal,
      body: 'New ticket: ' + ticketIdFinal + '\n\nSubject: ' + rowObj['Subject'] + '\n\nType: ' + rowObj['Type of Request']
    });

    Logger.log('Admin notification sent to:', ADMIN_EMAIL);
  } catch (mailErr) {
    Logger.log('ERROR sending email:', mailErr.toString());
    // Don't throw - email failure shouldn't block ticket creation
  }

  Logger.log('END: processCreateTicketFromJson - SUCCESS');
  Logger.log('='.repeat(80));
}

/**
 * Helper function to build email body for notifications
 */
function buildTicketEmailBody(rowObj, attachmentLinks) {
  var body = [
    'Hello,',
    '',
    'Your support request has been received.',
    '',
    'TICKET DETAILS:',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Ticket ID: ' + rowObj['ID'],
    'Subject: ' + rowObj['Subject'],
    'Type: ' + rowObj['Type of Request'],
    'Status: ' + rowObj['Status'],
    'Created: ' + rowObj['Created On'],
    '',
    'DESCRIPTION:',
    rowObj['Request'],
    '',
  ];

  if (attachmentLinks) {
    body.push('ATTACHMENTS:');
    body.push(attachmentLinks);
    body.push('');
  }

  body.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  body.push('We will review your request shortly.');
  body.push('');
  body.push('Thank you,');
  body.push('Support System');

  return body.join('\n');
}

// ==================== WHAT TO CHECK IF THIS STILL DOESN'T WORK ====================
/*

1. EMPTY EMAIL & NAME COLUMNS
   ────────────────────────────
   Cause: Your form doesn't capture email/name
   Fix: Either:
     a) Add fields to SupportForm.tsx:
        - Add <Input {...register("email")} placeholder="your@email.com" required />
        - Add <Input {...register("name")} placeholder="Your Name" required />
     
     b) Or remove those columns from SHEET_HEADERS in Code.gs:
        const SHEET_HEADERS = [
          'ID',
          'Created On',
          // Remove 'Email' if not capturing it
          // Remove 'Name' if not capturing it
          'Subject',
          'Type of Request',
          ...
        ];

2. MISSING "REQUEST" OR "SUBJECT" COLUMNS
   ────────────────────────────────────────
   Cause: Wrong mapping - form sends 'description', sheet expects 'Request'
   Fix: Already handled in the code above:
     'Request': data.description || data.request || ''
     'Subject': data.summary || data.subject || ''

3. ATTACHMENTS NOT APPEARING
   ──────────────────────────
   Cause: File upload failed or DRIVE_FOLDER_ID incorrect
   Check logs: Search execution log for "ERROR uploading file"
   Fix: Verify DRIVE_FOLDER_ID in Code.gs and folder permissions

4. STILL GETTING EMPTY ROWS
   ────────────────────────
   Steps:
   a) Check Google Apps Script execution log
   b) Look for "Row array (...)" to see what's being appended
   c) Verify SHEET_HEADERS order matches your actual sheet
   d) Check if sheet has more columns than SHEET_HEADERS expects

*/
