/**
 * HealthCenter
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface GetPractitionerScheduleDTO { 
    scheduleId?: number;
    practitionerId?: number;
    practitionerName?: string | null;
    patientId?: number | null;
    patientName?: string | null;
    startDateTime?: Date;
    endDateTime?: Date;
    reasonForVisit?: string | null;
}

