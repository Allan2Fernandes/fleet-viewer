import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MockEventsGeneratorComponent } from './mock-events-generator-component/mock-events-generator-component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'generate-mock-events',
    pathMatch: 'full'
  },
      {path: 'generate-mock-events', component: MockEventsGeneratorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsViewerRoutingModule { }
