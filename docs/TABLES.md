# Google Sheets Table Descriptions

## Patients Sheet
- **Patient ID** (Primary Key): e.g., "P001"
- **Patient Name**: e.g., "Иванов Иван Иванович"
- **Attached Doctor**: e.g., "Dr. Petrov"
- **Admission Date**: e.g., "2023-01-10"
- **Discharge Date**: e.g., "2023-01-15"
- **Ward**: e.g., "Кардиология"

## TimeSlots Sheet
- **TimeSlot ID** (Primary Key): e.g., 1, 2, 3, etc.
- **Time Slot**: e.g., "9.40-10.10", "10.20-10.50", etc.

## Specialists Sheet
- **Specialist ID** (Primary Key): e.g., "S001"
- **Specialist Name**: e.g., "Николаев Н.Н."

## Appointments Sheet
- **Record ID** (Primary Key): e.g., "R036"
- **Patient ID** (Foreign Key referencing Patients)
- **TimeSlot ID** (Foreign Key referencing TimeSlots)
- **Day of Week**: e.g., "Понедельник"
- **Place**: e.g., "Room 101"
- **Notes**: e.g., "Lab results review"
- **Specialist**: Stores the Specialist ID (e.g., "S001")
