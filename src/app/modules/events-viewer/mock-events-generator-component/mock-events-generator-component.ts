import { Component, inject } from '@angular/core';
import { LoadingOverlayComponent } from "../../shared/loading-overlay-component/loading-overlay-component";
import { Button } from "../../shared/button/button";
import { EventStore } from '../../../stores/events.store';
import { NavBar } from '../../shared/nav-bar/nav-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-mock-events-generator-component',
  imports: [LoadingOverlayComponent, Button, NavBar, ReactiveFormsModule],
  templateUrl: './mock-events-generator-component.html',
})
export class MockEventsGeneratorComponent {
  eventStore = inject(EventStore);
  fb = inject(FormBuilder);
  loading = this.eventStore.loading;

  form = this.fb.group({
    fleet_size: [100, [Validators.required]],
  });

  generateMockData() {
    this.eventStore.generateMockEvents(this.form.controls.fleet_size.value ?? 1);
  }
}
