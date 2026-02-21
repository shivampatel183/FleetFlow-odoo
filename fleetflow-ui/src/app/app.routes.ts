import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
            { path: 'vehicles', loadComponent: () => import('./pages/vehicles/vehicle-list/vehicle-list.component').then(m => m.VehicleListComponent) },
            { path: 'drivers', loadComponent: () => import('./pages/drivers/driver-list/driver-list.component').then(m => m.DriverListComponent) },
            { path: 'dispatch', loadComponent: () => import('./pages/trips/trip-dispatch/trip-dispatch.component').then(m => m.TripDispatchComponent) },
            { path: 'maintenance', loadComponent: () => import('./pages/maintenance/maintenance-list/maintenance-list.component').then(m => m.MaintenanceListComponent) },
            { path: 'fuel', loadComponent: () => import('./pages/fuel/fuel-list/fuel-list.component').then(m => m.FuelListComponent) },
            { path: 'reports', loadComponent: () => import('./pages/analytics/analytics-reports/analytics-reports.component').then(m => m.AnalyticsReportsComponent) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];
