import { Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
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
                path:'videos',
                component: DashboardComponent
            },
            {
                path:'playlists',
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
