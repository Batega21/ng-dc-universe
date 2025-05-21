import { Component, inject, signal } from '@angular/core';
import { HeroListComponent } from './hero-list/hero-list.component';
import { MatListModule } from '@angular/material/list';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { HeroesProvider } from '../../state/hero.store';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [
    LoaderComponent,
    HeroListComponent,
    MatListModule,
    UpperCasePipe,
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  readonly store = inject(HeroesProvider);
  public title = signal('Heroes');

}
