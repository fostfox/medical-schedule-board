function doGet() {
  return HtmlService.createTemplateFromFile('client/index')
    .evaluate()
    .setTitle('Расписание');
}

/**
 * Include function to load content of HTML files.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * getData() collects data from Patients, Appointments, TimeSlots, and Specialists.
 */
function getData() {
  var patients = getPatientsData(); // from Patients.gs

  var appointmentsInfo = getAppointmentsData(); // from Appointments.gs
  var appointments = appointmentsInfo.appointments;

  // Get timeslots data (we define it here since it is simple)
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var timeslotsSheet = ss.getSheetByName("TimeSlots");
  var timeslotsData = timeslotsSheet.getDataRange().getValues();
  var timeslotsHeaders = timeslotsData.shift();
  var timeslotsIndices = {};
  timeslotsHeaders.forEach(function (header, i) {
    timeslotsIndices[header] = i;
  });
  var timeslots = timeslotsData.map(function (row) {
    return {
      id: row[timeslotsIndices["TimeSlot ID"]],
      slot: row[timeslotsIndices["Time Slot"]]
    };
  });

  var specialists = getSpecialistsData(); // from Specialists.gs

  return {
    patients: patients,
    appointments: appointments,
    timeslots: timeslots,
    specialists: specialists
  };
}
