# Расписание Web App

This repository contains the source code for the "Расписание" web application built using Google Apps Script. The project is organized into client and server components to ease maintenance and future expansion.

## Repository Structure

```
/Расписание 
├── src 
│   ├── client 
│   │   ├── index.html               // Main HTML template (includes partials, CSS, and JS) 
│   │   ├── style.html               // Client-side CSS file (wrapped in <style> tags) 
│   │   ├── script.html              // Client-side JavaScript file (wrapped in <script> tags) 
│   │   ├── addAppointmentModal.html // Partial for the "Добавить прием" modal 
│   │   ├── appointmentModal.html    // Partial for the details/edit modal 
│   │   └── messageModal.html        // Partial for the custom message popup 
│   └── server 
│       ├── Main.gs                  // Contains doGet() and include() functions (entry point) 
│       ├── Appointments.gs          // Server-side functions for appointments (getData, add, update, delete) 
│       ├── Patients.gs              // Functions for reading patients data 
│       ├── Specialists.gs           // Functions for reading specialists data and mapping 
│       ├── Common.gs                // Common functions (e.g., lock handling) 
│       └── Config.gs                // Global configuration (e.g., Spreadsheet ID) 
├── scripts 
│   └── generateAndPush.js // Script to update Config.gs using environment variables and push the project via clasp. 
├── TABLES.md              // Description of Google Sheets tables with examples 
├── README.md              // This file 
└── appsscript.json        // Apps Script project manifest
```

## How CSS and JavaScript are Served

Google Apps Script does not serve static files directly. Instead, we use the `HtmlService.createTemplateFromFile()` and an `include()` function to embed the contents of our CSS and JavaScript files directly into our HTML output.

Since Google Apps Script only works with .gs and .html files, we store our CSS and JavaScript code in separate HTML files

## Configuration and Deployment Automation

This project includes a Node.js script to automate configuration updates and deployment. The script, located at [scripts/generateAndPush.js](scripts/generateAndPush.js), reads environment variables (for example, `SPREADSHEET_ID`), replaces placeholders (like `__SPREADSHEET_ID__`) in the Config.gs file, and pushes your project to Apps Script using clasp.

## Deployment

1. Install [clasp](https://developers.google.com/apps-script/guides/clasp) (the Apps Script CLI).
2. Clone the repository.
3. Replace `SPREADSHEET_ID` in the server-side files with your actual Google Sheet ID.
4. Run `clasp push` to upload your code.
5. Deploy the web app from the Google Apps Script dashboard.

## Additional Information

- The project uses LockService to prevent concurrent modifications. If a lock cannot be obtained, a user-friendly error message is shown.
- Custom modals replace native alerts for a better user experience.
- The Google Sheet is expected to have the following sheets:
  - **Patients**: Columns include Patient ID, Patient Name, Attached Doctor, Admission Date, Discharge Date, Ward.
  - **TimeSlots**: Columns include TimeSlot ID, Time Slot.
  - **Specialists**: Columns include Specialist ID, Specialist Name.
  - **Appointments**: Columns include Record ID, Patient ID, TimeSlot ID, Day of Week, Place, Notes, Specialist.

For further details, please see the [TABLES.md](TABLES.md) file.
