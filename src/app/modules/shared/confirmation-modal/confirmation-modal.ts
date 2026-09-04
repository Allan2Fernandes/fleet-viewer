import { Component, input, output } from '@angular/core';
import { ICONS } from '../../../constants/icons';
import { ConfirmationModalData } from '../../../models/ConfirmationModalData';
import { BaseModal } from "../base-modal/base-modal";
import { Button } from '../button/button';
import { TranslatePipe } from '../../../pipes/translate-pipe';

@Component({
  selector: 'app-confirmation-modal',
  imports: [BaseModal, Button, TranslatePipe],
  templateUrl: './confirmation-modal.html',
  
})
export class ConfirmationModal {
  icons = ICONS;
  data = input.required<ConfirmationModalData>();
  
  closed = output<boolean>();
}
