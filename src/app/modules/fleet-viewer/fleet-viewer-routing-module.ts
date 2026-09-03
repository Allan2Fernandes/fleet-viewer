import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { TrendViewer } from './trend-viewer/trend-viewer';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {path: 'dashboard', component: DashboardComponent},
    {path: 'trend-viewer', component: TrendViewer}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetViewerRoutingModule { }
