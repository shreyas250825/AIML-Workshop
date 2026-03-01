// ============================================
// QUIZ GOOGLE APPS SCRIPT CODE
// This is for the QUIZ spreadsheet
// Copy ALL of this and paste into your Quiz Google Apps Script
// ============================================

// ---------------- POST HANDLER (Submit Quiz) ----------------
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.name,
    data.regNo,
    data.quizTitle,
    data.score,
    data.totalQuestions,
    data.timeTaken,
    data.submissionType
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------- GET HANDLER (Get Quiz Leaderboard) ----------------
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Remove header row
  data.shift();
  
  // Helper function to parse time string to seconds
  const parseTime = (timeStr) => {
    if (!timeStr) return 999999;
    const match = String(timeStr).match(/(\d+)\s*min\s*(\d+)\s*sec/);
    if (!match) return 999999;
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  };
  
  // Sort by score (descending), then by time (ascending)
  data.sort((a, b) => {
    const scoreA = Number(a[4]) || 0;
    const scoreB = Number(b[4]) || 0;
    
    if (scoreB === scoreA) {
      // If scores are equal, lower time wins (faster is better)
      const timeA = parseTime(a[6]);
      const timeB = parseTime(b[6]);
      return timeA - timeB;
    }
    // Higher score wins
    return scoreB - scoreA;
  });
  
  // Return all sorted data
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
