/**
 * HealthCenter
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { UserRole } from './userRole';


export interface UserUpdateDto { 
    userId?: number;
    userName?: string | null;
    role?: UserRole;
    email?: string | null;
    password?: string | null;
    practitionerId?: number | null;
}
export namespace UserUpdateDto {
}

