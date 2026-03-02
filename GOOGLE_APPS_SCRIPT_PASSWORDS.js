// Google Apps Script for Password Management
// Deploy this as a Web App with "Anyone" access

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Passwords');
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Passwords sheet not found'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const passwords = rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  }).filter(row => row.caseStudyName); // Filter out empty rows
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: passwords
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Passwords');
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Passwords sheet not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'add') {
      // Add new password entry
      sheet.appendRow([
        data.caseStudyName,
        data.stepName,
        data.password,
        new Date().toISOString()
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Password added successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'delete') {
      // Delete password entry by case study and step name
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      for (let i = values.length - 1; i > 0; i--) {
        if (values[i][0] === data.caseStudyName && values[i][1] === data.stepName) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Password deleted successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
