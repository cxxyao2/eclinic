/**
 * HealthCenter
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { AppointmentStatusEnum } from './appointmentStatusEnum';


export interface AddAppointmentDTO { 
    patientId?: number;
    availableId?: number;
    reasonForVisit?: string | null;
    status?: AppointmentStatusEnum;
}
export namespace AddAppointmentDTO {
}


