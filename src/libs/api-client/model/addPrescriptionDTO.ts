/**
 * HealthCenter
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface AddPrescriptionDTO { 
    visitId?: number;
    patientId?: number;
    practitionerId?: number;
    medicationId?: number;
    dosage?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    notes?: string | null;
}

