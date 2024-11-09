export interface Patient {
    patientID: number;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    emergencyContact?: string;
    emergencyPhoneNumber?: string;
    createdDate: Date;
}