// Define the menu structure as a constant in Angular
export const MENU_STRUCTURE = [
  {
    name: 'Reception',
    subMenus: [
      { name: 'ok...Book Appointment' },
      { name: 'okCheck-In' },
      { name: 'okPatient Registration' },
      { name: 'okWaiting List' },
      { name: 'okConsultation' },
      { name: 'okLab Results' },
      { name: 'okMRI Images' },
      { name: 'okAppointment History' },
      { name: 'okvirtual group consultation' },
      { name: 'Billing & Payments' }
    ]
  },
  {
    name: 'Pharmacy',
    subMenus: [

      { name: 'Medicine Inventory' },
      { name: 'Purchase Requests' },
      { name: 'okDispense Medication' },
      { name: 'Prescription History' },
      { name: 'Stock Management' },
      { name: 'Supplier Information' }
    ]
  },
  {
    name: 'In-Hospital',
    subMenus: [
      { name: 'okPatient Admission' },
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
    name: 'Medical Staff',
    subMenus: [
      { name: 'Doctor Schedules' },
      { name: 'Nursing Assignments' },
      { name: 'okStaff Authorization' }
    ]
  },
  {
    name: 'Reports & Analytics',
    subMenus: [
      { name: 'okDaily Reports' },
      { name: 'okPatient Statistics' },
      { name: 'okFinancial Reports' },
      { name: 'okMedication Usage' },
      { name: 'okTreatment Success Rates' },
      { name: 'okStaff Performance' }
    ]
  }
];
