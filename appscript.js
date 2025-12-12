var NOTIFY_EMAIL = "winston.barbe@gmail.com";
var SHEET_ID = "YOUR_SHEET_ID_HERE";
var SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    var email = (e.parameter.email || "").trim();
    var nickname = (e.parameter.nickname || "").trim(); // honeypot

    // Honeypot: bots often fill this
    if (nickname) {
      return respond_({ status: "ok" }); // pretend success, do nothing
    }

    // Validate email
    if (!email || email.length > 254 || !isValidEmail_(email)) {
      return respond_({ status: "invalid_email" });
    }

    // Duplicate check - Column B (2nd column) contains emails
    // Row 1 is the header "Email", so we start checking from row 2
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      // Get all emails from column B (column index 2), starting from row 2
      // getRange(row, column, numRows, numColumns)
      var emailColumn = 2; // Column B
      var headerRow = 1;
      var dataStartRow = 2;
      var numDataRows = lastRow - headerRow;

      var existingEmails = sheet
        .getRange(dataStartRow, emailColumn, numDataRows, 1)
        .getValues();
      var emailLower = email.toLowerCase().trim();

      var already = existingEmails.some(function (row) {
        var existingEmail = String(row[0] || "")
          .toLowerCase()
          .trim();
        return existingEmail === emailLower && existingEmail.length > 0;
      });

      if (already) {
        return respond_({ status: "already_subscribed" });
      }
    }

    // Append + notify
    var timestamp = new Date();
    sheet.appendRow([timestamp, email]);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: "New mailing list signup",
      body:
        "A new email was added:\n\nEmail: " + email + "\nTime: " + timestamp,
    });

    return respond_({ status: "subscribed" });
  } catch (err) {
    return respond_({ status: "error", message: err.toString() });
  }
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function respond_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
