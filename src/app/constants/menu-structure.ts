// Define the menu structure as a constant in Angular
export const MENU_STRUCTURE = [
  {
    name: 'Reception',
    subMenus: [
      { name: 'Book Appointment' },
      { name: 'Check-In' },
      { name: 'Patient Registration' },
      { name: 'Waiting List' },
      { name: 'Consultation' },
      { name: 'Lab Results'},
      { name: 'MRI Images'},
      { name: 'Appointment History' },
      { name: 'Billing & Payments' }
    ]
  },
  {
    name: 'Pharmacy',
    subMenus: [
     
      { name: 'Medicine Inventory' },
      { name: 'Purchase Requests' },
      { name: 'Dispense Medication' },
      { name: 'Prescription History' },
      { name: 'Stock Management' },
      { name: 'Supplier Information' }
    ]
  },
  {
    name: 'In-Hospital',
    subMenus: [
      { name: 'Patient Admission' },
      { name: 'Ward Management' },
      { name: 'Bed Allocation' },
      { name: 'Inpatient Records' },
      { name: 'Nursing Schedules' },
      { name: 'Discharge Summary' },
      { name: 'Daily Rounds' }
    ]
  },
  {
    name: 'Data Exchange Center',
    subMenus: [
      { name: 'Patient Data Exchange' },
      { name: 'Lab Results Sharing' },
      { name: 'EHR (Electronic Health Records) Import/Export' },
      { name: 'Inter-Facility Transfer' },
      { name: 'External Consultations' },
      { name: 'Data Compliance Reports' },
      { name: 'Audit Logs' }
    ]
  },
  {
    name: 'Emergency Services',
    subMenus: [
      { name: 'Emergency Intake' },
      { name: 'Triage Management' },
      { name: 'Ambulance Dispatch' },
      { name: 'Critical Care Units' },
      { name: 'Emergency Contacts' }
    ]
  },
  {
    name: 'Medical Staff',
    subMenus: [
      { name: 'Doctor Schedules' },
      { name: 'On-Call Staff' },
      { name: 'Specialist Directory' },
      { name: 'Nursing Assignments' },
      { name: 'Training & Certifications' },
      { name: 'Staff Availability' }
    ]
  },
  {
    name: 'Reports & Analytics',
    subMenus: [
      { name: 'Daily Reports' },
      { name: 'Patient Statistics' },
      { name: 'Financial Reports' },
      { name: 'Medication Usage' },
      { name: 'Treatment Success Rates' },
      { name: 'Staff Performance' }
    ]
  }
];
