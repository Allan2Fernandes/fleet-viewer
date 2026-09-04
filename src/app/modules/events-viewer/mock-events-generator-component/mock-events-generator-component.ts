import { Component, inject } from '@angular/core';
import { LoadingOverlayComponent } from "../../shared/loading-overlay-component/loading-overlay-component";
import { Button } from "../../shared/button/button";
import { EventStore } from '../../../stores/events.store';
import { NavBar } from '../../shared/nav-bar/nav-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PopupService } from '../../../services/popup-service';
import { ConfirmationModalData } from '../../../models/ConfirmationModalData';
import { ConfirmationModal } from '../../shared/confirmation-modal/confirmation-modal';
import { TranslationService } from '../../../services/translation-service';
import { take } from 'rxjs';
import { Helper } from '../../../services/helper';
import { TranslatePipe } from '../../../pipes/translate-pipe';

@Component({
  selector: 'app-mock-events-generator-component',
  imports: [LoadingOverlayComponent, Button, NavBar, ReactiveFormsModule, TranslatePipe],
  templateUrl: './mock-events-generator-component.html',
})
export class MockEventsGeneratorComponent {
  eventStore = inject(EventStore);
  fb = inject(FormBuilder);
  popupService = inject(PopupService);
  translationService = inject(TranslationService);
  loading = this.eventStore.loading;

  form = this.fb.group({
    fleet_size: [100, [Validators.required]],
  });

  generateMockData() {
    const subject = this.popupService.open<boolean, ConfirmationModalData>(ConfirmationModal, {title: this.translationService.translate('CONFIMATION_MODAL_TITLE_FLEET'), body: this.translationService.translate('CONFIMATION_MODAL_DESCRIPTION_FLEET')});
    subject.pipe(take(1)).subscribe((res) => {
      if(!Helper.isNullOrUndefined(res) && res) {
        this.eventStore.generateNewFleet(this.form.controls.fleet_size.value ?? 1);
      }
    });
  }

  generateMoreMockData() {
    const subject = this.popupService.open<boolean, ConfirmationModalData>(ConfirmationModal, {title: this.translationService.translate('CONFIMATION_MODAL_TITLE_DATA'), body: this.translationService.translate('CONFIMATION_MODAL_DESCRIPTION_DATA')});
    subject.pipe(take(1)).subscribe(res => {
      if(!Helper.isNullOrUndefined(res) && res) {
        this.eventStore.generateEventsForExistingFleet();
      }
    }) 
  }
}
