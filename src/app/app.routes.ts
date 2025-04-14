import { Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { LoginComponent } from './admin/login/login.component';
import { WaitingListComponent } from './patient/waiting-list/waiting-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchPopupComponent } from './shared/search-popup/search-popup.component';
import { authGuard } from './service/auth.guard';

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
        loadChildren: () => import('./features/chat/chat.routes').then(c => c.chatRoutes), canActivate: [authGuard]
    },
    {
        path: 'admin',
        loadComponent: () => import('./admin/admin/admin.component').then(c => c.AdminComponent),
        children: [
            {
                path: 'waitlist',
                loadComponent: () => import('./patient/waiting-list/waiting-list.component').then(c => c.WaitingListComponent)
            },
            {
                path: 'authorize',
                loadComponent: () => import('./admin/authorization/authorization.component').then(c => c.AuthorizationComponent),
                canActivate: [authGuard]
            }
        ]
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
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'search',
        component: SearchPopupComponent
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    { path: '**', component: PageNotFoundComponent },
];
