import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-overlay-component',
  imports: [],
  templateUrl: './loading-overlay-component.html',
})
export class LoadingOverlayComponent {
  loading = input(false);
}
