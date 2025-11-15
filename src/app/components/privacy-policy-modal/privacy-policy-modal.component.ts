import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-privacy-policy-modal',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './privacy-policy-modal.component.html',
  styleUrl: './privacy-policy-modal.component.scss',
})
export class PrivacyPolicyModalComponent {}
