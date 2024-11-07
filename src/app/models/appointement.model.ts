// appointment.model.ts
export interface Appointment {
    AppointmentID?: number;
    PatientID?: number;
    PractitionerID: number;
    AppointmentDate: Date;
    ReasonForVisit?: string;
    Status: AppointmentStatusEnum;
}

export enum AppointmentStatusEnum {
    Available = 'Available',
    Scheduled = 'Scheduled',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}
