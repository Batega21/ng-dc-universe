import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button-back',
  imports: [MatButtonModule, RouterLink, MatIconModule, MatTooltipModule],
  template: `
    <button mat-icon-button matTooltip="Return to the Home page" class="button-go-back" aria-label="Go back button"
      [routerLink]="['/']" routerLinkActive="router-link-active">
      <mat-icon>arrow_back</mat-icon>
    </button>`,
  styleUrls: ['./button-back.component.scss'],
})
export class ButtonBackComponent {

}
