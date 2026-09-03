import { Component, inject } from '@angular/core';
import { LoadingOverlayComponent } from "../../shared/loading-overlay-component/loading-overlay-component";
import { Button } from "../../shared/button/button";
import { EventStore } from '../../../stores/events.store';

@Component({
  selector: 'app-mock-events-generator-component',
  imports: [LoadingOverlayComponent, Button],
  templateUrl: './mock-events-generator-component.html',
})
export class MockEventsGeneratorComponent {
  eventStore = inject(EventStore);
  loading = this.eventStore.loading;

  generateMockData() {
    this.eventStore.generateMockEvents();
  }
}
