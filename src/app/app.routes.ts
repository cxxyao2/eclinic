import { Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { ConsultationFormComponent } from './patient/consultation-form/consultation-form.component';
import { CheckInComponent } from './patient/check-in/check-in.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: 'checkin',
        component: CheckInComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'content',
        component: DashboardComponent,
        children: [
            {
                path: 'videos',
                component: ConsultationFormComponent
            },
            {
                path: 'playlists',
                component: DashboardComponent
            },
            {
                path: 'posts',
                component: DashboardComponent
            }
        ]
    },
    {
        path: 'analytics',
        component: DashboardComponent
    },
    {
        path: 'comments',
        component: DashboardComponent

    }
];
