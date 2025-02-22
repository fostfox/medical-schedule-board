/** Patients.gs **/

function getPatientsData() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName("Patients");
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  var indices = {};
  headers.forEach(function(header, i) {
    indices[header] = i;
  });
  var patients = data.map(function(row) {
    return {
      id: row[indices["Patient ID"]],
      name: row[indices["Patient Name"]],
      doctor: row[indices["Attached Doctor"]],
      admission: row[indices["Admission Date"]],
      discharge: row[indices["Discharge Date"]],
      ward: row[indices["Ward"]]
    };
  });
  return patients;
}
