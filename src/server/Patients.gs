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

function addPatient(formData) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch(e) {
    return "Ошибка: не удалось получить блокировку, попробуйте позже.";
  }
  try {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName("Patients");
    var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var indices = {};
    headerRow.forEach(function(header, i) {
      indices[header] = i;
    });

    // Determine latest Patient ID.
    var dataRange = sheet.getRange(2, indices["Patient ID"] + 1, sheet.getLastRow() - 1, 1).getValues();
    var maxId = 0;
    dataRange.forEach(function(row) {
      var idStr = row[0];
      if (idStr && typeof idStr === "string" && idStr.indexOf("P") === 0) {
        var num = parseInt(idStr.substring(1));
        if (num > maxId) maxId = num;
      }
    });
    var newId = "P" + ("000" + (maxId + 1)).slice(-3);

    var newRow = new Array(headerRow.length).fill("");
    newRow[indices["Patient ID"]] = newId;
    newRow[indices["Patient Name"]] = formData.name;
    newRow[indices["Attached Doctor"]] = formData.doctor;
    newRow[indices["Admission Date"]] = formData.admission;
    newRow[indices["Discharge Date"]] = formData.discharge;
    newRow[indices["Ward"]] = formData.ward;
    sheet.appendRow(newRow);
    return "Пациент успешно добавлен с ID: " + newId;
  } finally {
    lock.releaseLock();
  }
}

function updatePatient(formData) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch(e) {
    return "Ошибка: не удалось получить блокировку, попробуйте позже.";
  }
  try {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName("Patients");
    var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var indices = {};
    headerRow.forEach(function(header, i) {
      indices[header] = i;
    });
    var data = sheet.getRange(2, 1, sheet.getLastRow()-1, sheet.getLastColumn()).getValues();
    for(var i = 0; i < data.length; i++){
      if(data[i][indices["Patient ID"]] == formData.id){
        data[i][indices["Patient Name"]] = formData.name;
        data[i][indices["Attached Doctor"]] = formData.doctor;
        data[i][indices["Admission Date"]] = formData.admission;
        data[i][indices["Discharge Date"]] = formData.discharge;
        data[i][indices["Ward"]] = formData.ward;
        sheet.getRange(i+2, 1, 1, sheet.getLastColumn()).setValues([data[i]]);
        return "Пациент успешно обновлен";
      }
    }
    return "Пациент не найден";
  } finally {
    lock.releaseLock();
  }
}

function deletePatient(patientId) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch(e) {
    return "Ошибка: не удалось получить блокировку, попробуйте позже.";
  }
  try {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    // Delete patient row.
    var sheet = ss.getSheetByName("Patients");
    var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var indices = {};
    headerRow.forEach(function(header, i){
      indices[header] = i;
    });
    var data = sheet.getRange(2, 1, sheet.getLastRow()-1, sheet.getLastColumn()).getValues();
    var found = false;
    for(var i = 0; i < data.length; i++){
      if(data[i][indices["Patient ID"]] == patientId){
        sheet.deleteRow(i+2);
        found = true;
        break;
      }
    }
    if(!found) return "Пациент не найден";
    
    // Delete associated appointments.
    var appSheet = ss.getSheetByName("Appointments");
    var appData = appSheet.getDataRange().getValues();
    var appHeaders = appData.shift();
    var appIndices = {};
    appHeaders.forEach(function(header, i) {
      appIndices[header] = i;
    });
    var rowsToDelete = [];
    for(var i = 0; i < appData.length; i++){
      if(appData[i][appIndices["Patient ID"]] == patientId){
        rowsToDelete.push(i+2);
      }
    }
    rowsToDelete.sort(function(a, b){ return b - a; });
    rowsToDelete.forEach(function(rowNum){
      appSheet.deleteRow(rowNum);
    });
    return "Пациент и все связанные приемы успешно удалены";
  } finally {
    lock.releaseLock();
  }
}
