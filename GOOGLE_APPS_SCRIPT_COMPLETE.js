// ============================================
// COMPLETE GOOGLE APPS SCRIPT CODE
// Copy ALL of this and paste into your Google Apps Script
// ============================================

// ---------------- POST HANDLER ----------------
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    let result;
    if (action === "signup") {
      result = handleSignup(data);
    } else if (action === "login") {
      result = handleLogin(data);
    } else {
      result = jsonResponse({ status: "invalid_action" });
    }
    
    return result;
  } catch (error) {
    return jsonResponse({ 
      status: "error", 
      message: error.toString() 
    });
  }
}

// ---------------- GET HANDLER ----------------
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    let result;
    if (action === "checkAuth") {
      result = jsonResponse({ status: "ok" });
    } else if (action === "getUsers") {
      const sheet = getSheet();
      if (!sheet) {
        return jsonResponse({ 
          status: "error", 
          message: "Sheet not found. Please check sheet name." 
        });
      }
      const data = sheet.getDataRange().getValues();
      data.shift(); // remove header
      result = jsonResponse(data);
    } else {
      result = jsonResponse({ status: "invalid_request" });
    }
    
    return result;
  } catch (error) {
    return jsonResponse({ 
      status: "error", 
      message: error.toString() 
    });
  }
}

// ---------------- GET SHEET HELPER ----------------
function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Try different possible sheet names
  let sheet = spreadsheet.getSheetByName("Users");
  if (!sheet) {
    sheet = spreadsheet.getSheetByName("Sheet1");
  }
  if (!sheet) {
    // Get the first sheet if named sheets don't exist
    sheet = spreadsheet.getSheets()[0];
  }
  
  return sheet;
}

// ---------------- SIGNUP ----------------
function handleSignup(data) {
  try {
    const sheet = getSheet();
    if (!sheet) {
      return jsonResponse({ 
        status: "error", 
        message: "Sheet not found" 
      });
    }
    
    const users = sheet.getDataRange().getValues();
    
    // Check if email already exists (skip header row)
    for (let i = 1; i < users.length; i++) {
      const sheetEmail = String(users[i][3]).trim().toLowerCase();
      const signupEmail = String(data.email).trim().toLowerCase();
      
      if (sheetEmail === signupEmail) {
        return jsonResponse({ status: "exists" });
      }
    }
    
    // Append new user (5 columns: timestamp, name, usn, email, password)
    sheet.appendRow([
      new Date(),
      data.name,
      data.usn,
      data.email,
      data.password
    ]);
    
    return jsonResponse({ status: "success" });
  } catch (error) {
    return jsonResponse({ 
      status: "error", 
      message: error.toString() 
    });
  }
}

// ---------------- LOGIN ----------------
function handleLogin(data) {
  try {
    const sheet = getSheet();
    if (!sheet) {
      return jsonResponse({ 
        status: "error", 
        message: "Sheet not found" 
      });
    }
    
    const users = sheet.getDataRange().getValues();
    
    // Skip header row
    for (let i = 1; i < users.length; i++) {
      // Trim whitespace and compare (case-insensitive for email)
      const sheetEmail = String(users[i][3]).trim().toLowerCase();
      const sheetPassword = String(users[i][4]).trim();
      const loginEmail = String(data.email).trim().toLowerCase();
      const loginPassword = String(data.password).trim();
      
      if (sheetEmail === loginEmail && sheetPassword === loginPassword) {
        return jsonResponse({
          status: "success",
          name: users[i][1],
          usn: users[i][2]
        });
      }
    }
    
    return jsonResponse({ status: "invalid" });
  } catch (error) {
    return jsonResponse({ 
      status: "error", 
      message: error.toString() 
    });
  }
}

// ---------------- HELPER ----------------
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
