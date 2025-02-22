/** Appointments.gs **/

function getAppointmentsData() {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName("Appointments");
    var data = sheet.getDataRange().getValues();
    var headers = data.shift();
    var indices = {};
    headers.forEach(function(header, i) {
      indices[header] = i;
    });
    var specialistsMap = getSpecialistsMap(); // from Specialists.gs
    var appointments = data.map(function(row) {
      var specialistId = row[indices["Specialist"]];
      return {
        record: row[indices["Record ID"]],
        patientId: row[indices["Patient ID"]],
        timeslotId: row[indices["TimeSlot ID"]],
        day: row[indices["Day of Week"]],
        place: row[indices["Place"]],
        notes: row[indices["Notes"]],
        specialist: specialistsMap[specialistId] || "",
        specialistId: specialistId
      };
    });
    return {
      appointments: appointments,
      headers: headers,
      indices: indices
    };
  }
  
  function addAppointment(formData) {
    var lock = acquireLock();
    try {
      var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
      var sheet = ss.getSheetByName("Appointments");
      var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var indices = {};
      headerRow.forEach(function(header, i) {
        indices[header] = i;
      });
      
      // Conflict check: for each day, ensure no appointment exists for the same patient and timeslot.
      var allData = sheet.getDataRange().getValues();
      var conflicts = [];
      for (var i = 1; i < allData.length; i++) {
        var row = allData[i];
        formData.days.forEach(function(day) {
          if (row[indices["Patient ID"]] == formData.patientId &&
              row[indices["TimeSlot ID"]] == formData.timeslotId &&
              row[indices["Day of Week"]] == day) {
            conflicts.push(day);
          }
        });
      }
      if (conflicts.length > 0) {
        return "Ошибка: Для выбранного пациента в выбранном временном интервале уже есть прием в следующие дни: " +
               conflicts.join(", ") + ". Пожалуйста, выберите другой интервал или удалите существующий прием.";
      }
      
      // Determine latest Record ID.
      var dataRange = sheet.getRange(2, indices["Record ID"] + 1, sheet.getLastRow() - 1, 1).getValues();
      var maxId = 0;
      dataRange.forEach(function(row) {
        var idStr = row[0];
        if (idStr && typeof idStr === "string" && idStr.indexOf("R") === 0) {
          var num = parseInt(idStr.substring(1));
          if (num > maxId) maxId = num;
        }
      });
      
      var responses = [];
      formData.days.forEach(function(day) {
        maxId++;
        var newRecordId = "R" + ("000" + maxId).slice(-3);
        var newRow = new Array(headerRow.length).fill("");
        newRow[indices["Record ID"]] = newRecordId;
        newRow[indices["Patient ID"]] = formData.patientId;
        newRow[indices["TimeSlot ID"]] = formData.timeslotId;
        newRow[indices["Day of Week"]] = day;
        newRow[indices["Place"]] = formData.place;
        newRow[indices["Notes"]] = formData.notes;
        newRow[indices["Specialist"]] = formData.specialist; // specialist id
        sheet.appendRow(newRow);
        responses.push(newRecordId);
      });
      return "Прием(ы) успешно добавлены: " + responses.join(", ");
    } finally {
      lock.releaseLock();
    }
  }
  
  function deleteAppointment(recordId) {
    var lock = acquireLock();
    try {
      var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
      var sheet = ss.getSheetByName("Appointments");
      var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var indices = {};
      headerRow.forEach(function(header, i) {
        indices[header] = i;
      });
      var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
      var recordCol = indices["Record ID"];
      for (var i = 0; i < data.length; i++) {
        if (data[i][recordCol] === recordId) {
          sheet.deleteRow(i + 2);
          return "Прием " + recordId + " успешно удален";
        }
      }
      return "Прием не найден";
    } finally {
      lock.releaseLock();
    }
  }
  
  function updateAppointment(formData) {
    var lock = acquireLock();
    try {
      var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
      var sheet = ss.getSheetByName("Appointments");
      var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var indices = {};
      headerRow.forEach(function(header, i) {
        indices[header] = i;
      });
      var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
      var recordCol = indices["Record ID"];
      for (var i = 0; i < data.length; i++) {
        if (data[i][recordCol] === formData.record) {
          data[i][indices["TimeSlot ID"]] = formData.timeslotId;
          data[i][indices["Specialist"]] = formData.specialist;
          data[i][indices["Notes"]] = formData.notes;
          sheet.getRange(i + 2, 1, 1, sheet.getLastColumn()).setValues([data[i]]);
          return "Прием " + formData.record + " успешно обновлен";
        }
      }
      return "Прием не найден";
    } finally {
      lock.releaseLock();
    }
  }
  