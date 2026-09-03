import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'fleet-viewer',
        pathMatch: 'full'
    },
    {
        path: 'fleet-viewer',
        loadChildren: () => import('./modules/fleet-viewer/fleet-viewer-routing-module').then(m => m.FleetViewerRoutingModule),
    },
    {
        path: 'events',
        loadChildren: () => import('./modules/events-viewer/events-viewer-module').then(m => m.EventsViewerModule),
    }
];
