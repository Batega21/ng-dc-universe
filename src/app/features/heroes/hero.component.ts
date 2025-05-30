import { Component, inject, signal } from '@angular/core';
import { HeroListComponent } from './hero-list/hero-list.component';
import { MatListModule } from '@angular/material/list';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { HeroesStore } from '../../state/hero.store';
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
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent {
  readonly store = inject(HeroesStore);
  public title = signal('Heroes');

}
