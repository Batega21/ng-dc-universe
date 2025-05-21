import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button-back',
  imports: [MatButtonModule, RouterLink, MatIconModule, MatTooltipModule],
  templateUrl: './button-back.component.html',
  styleUrl: './button-back.component.scss'
})
export class ButtonBackComponent {

}
