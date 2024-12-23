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
import { UpdateUserComponent } from './admin/update-user/update-user.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InpatientBedAssignComponent } from './inpatient-bed-assign/inpatient-bed-assign.component';

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
        path: "inpatient/:roomId",
        component: InpatientBedAssignComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'update-user',
        component: UpdateUserComponent
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    { path: '**', component: PageNotFoundComponent },
];
