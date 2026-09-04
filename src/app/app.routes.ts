import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/shared/page-not-found-component/page-not-found-component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'authorization',
        pathMatch: 'full'
    },
    {
        path: 'authorization',
        loadChildren: () => import('./modules/authoziation-module/authoziation-module-module').then(m => m.AuthoziationModuleModule),
    },
    {
        path: 'fleet-viewer',
        loadChildren: () => import('./modules/fleet-viewer/fleet-viewer-routing-module').then(m => m.FleetViewerRoutingModule),
    },
    {
        path: 'events',
        loadChildren: () => import('./modules/events-viewer/events-viewer-module').then(m => m.EventsViewerModule),
    },
        {
        path: 'not-found',
        component: PageNotFoundComponent
    },
    {
        path: '**',
        redirectTo: 'not-found'
    },
];
