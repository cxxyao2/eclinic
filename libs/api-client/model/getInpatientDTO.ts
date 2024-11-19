/**
 * HealthCenter
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface GetInpatientDTO { 
    inpatientId?: number;
    patientId?: number;
    patientName?: string | null;
    practitionerId?: number;
    practitionerName?: string | null;
    nurseId?: number | null;
    nurseName?: string | null;
    admissionDate?: Date;
    dischargeDate?: Date | null;
    roomNumber?: string | null;
    bedNumber?: string | null;
    reasonForAdmission?: string | null;
    createdDate?: Date;
}

