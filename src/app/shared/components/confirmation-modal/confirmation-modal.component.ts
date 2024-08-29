import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
})
export class ConfirmationModal {}
