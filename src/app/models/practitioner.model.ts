// practitioner.model.ts
export interface Practitioner {
    practitionerId: number;
    firstName: string;
    lastName: string;
    specialty?: string;
    phoneNumber?: string;
    email?: string;
    createdDate: Date;
  }
  