/**
 * HealthCenter
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface GetPrescriptionDTO { 
    prescriptionId?: number;
    patientId?: number;
    practitionerId?: number;
    practitionerName?: string | null;
    medicationId?: number;
    medicationName?: string | null;
    dosage?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    notes?: string | null;
}

