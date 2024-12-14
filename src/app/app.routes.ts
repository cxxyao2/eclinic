import { Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { ConsultationFormComponent } from './patient/consultation-form/consultation-form.component';
import { CheckInComponent } from './patient/check-in/check-in.component';
import { PractitionerScheduleComponent } from './staff/practitioner-schedule/practitioner-schedule.component';
import { LoginComponent } from './admin/login/login.component';
import { InpatientAdmitComponent } from './patient/inpatient-admit/inpatient-admit.component';
import { WaitingListComponent } from './patient/waiting-list/waiting-list.component';
import { BookAppointmentComponent } from './patient/book-appointment/book-appointment.component';
import { AuthorizationComponent } from './admin/authorization/authorization.component';
import { AdminComponent } from './admin/admin/admin.component';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
    },

    {
        path: 'available',
        component: PractitionerScheduleComponent,
    },
    {
        path: 'booking',
        component: BookAppointmentComponent,
    },
    {
        path: 'checkin',
        component: CheckInComponent
    },
    {
        path: 'consultation',
        component: ConsultationFormComponent
    },
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            {
                path: 'waitlist',
                component: WaitingListComponent
            },
            {
                path: 'authorize',
                component: AuthorizationComponent
            }
        ]
    },
    {
        path: 'inpatient',
        component: InpatientAdmitComponent,
    },
    {
        path: 'login',
        component: LoginComponent

    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    { path: '**', redirectTo: '/dashboard' },
];
