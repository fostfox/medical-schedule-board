/** Specialists.gs **/

function getSpecialistsData() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName("Specialists");
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  var indices = {};
  headers.forEach(function(header, i) {
    indices[header] = i;
  });
  var specialists = data.map(function(row) {
    return {
      id: row[indices["Specialist ID"]],
      name: row[indices["Specialist Name"]]
    };
  });
  return specialists;
}

function getSpecialistsMap() {
  var specialists = getSpecialistsData();
  var map = {};
  specialists.forEach(function(s) {
    map[s.id] = s.name;
  });
  return map;
}
