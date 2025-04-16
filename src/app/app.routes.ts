import { Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { WaitingListComponent } from './patient/waiting-list/waiting-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { authGuard } from './services/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { medicalStaffGuard } from '@services/medical-staff.guard';
import { MedicalSearchComponent } from './shared/medical-search/medical-search.component';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'available',
        loadComponent: () => import('./staff/practitioner-schedule/practitioner-schedule.component').then(c => c.PractitionerScheduleComponent)
    },
    {
        path: 'booking',
        loadComponent: () => import('./patient/book-appointment/book-appointment.component').then(c => c.BookAppointmentComponent)
    },
    {
        path: 'checkin',
        loadComponent: () => import('./patient/check-in/check-in.component').then(c => c.CheckInComponent)
    },
    {
        path: 'consultation',
        loadComponent: () => import('./patient/consultation-form/consultation-form.component').then(c => c.ConsultationFormComponent)
    },
    {
        path: 'chat',
        loadChildren: () => import('./features/chat/chat.routes').then(c => c.chatRoutes),
        canActivate: [medicalStaffGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'forget-password',
        loadComponent: () => import('./auth/forget-password/forget-password.component').then(c => c.ForgetPasswordComponent)
    },
    {
        path: 'reset-password',
        loadComponent: () => import('./auth/reset-password/reset-password.component').then(c => c.ResetPasswordComponent)
    },
    {
        path: 'activate-account',
        loadComponent: () => import('./auth/active-account/active-account.component').then(c => c.ActiveAccountComponent)
    },
    {
        path: 'waitlist',
        component: WaitingListComponent
    },
    {
        path: 'authorize',
        loadComponent: () => import('./admin/admin/authorization/authorization.component').then(c => c.AuthorizationComponent),
        canActivate: [authGuard]
    },
    {
        path: 'inpatient',
        loadComponent: () => import('./patient/inpatient-admit/inpatient-admit.component').then(c => c.InpatientAdmitComponent)
    },
    {
        path: "inpatient/:roomNumber",
        loadComponent: () => import('./inpatient-bed-assign/inpatient-bed-assign.component').then(c => c.InpatientBedAssignComponent)
    },
    {
        path: 'search',
        component: MedicalSearchComponent,
        title: 'Search Medical Cases'
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    { path: '**', component: PageNotFoundComponent },
];
