import { Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { TitleCasePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';

import { Hero } from '../../../core/interfaces/hero';
import { ButtonBackComponent } from '../../../shared/button-back/button-back.component';
import { HeroesStore } from '../../../state/hero.store';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatGridListModule,
    MatListModule,
    TitleCasePipe,
    ButtonBackComponent,
  ],
  providers: [],
})
export class HeroDetailComponent {
  private readonly store = inject(HeroesStore);
  public hero: WritableSignal<Hero> = signal({} as Hero);
  @Input()
  set id(heroId: number) {
    this.getHeroDetails(heroId);
  }
  get id(): number {
    return this.hero()?.id || 0;
  }
  

  public getHeroDetails(heroId: number) {
    this.store.getHeroById(heroId);
    this.hero.update(() => this.store.selectedHero());
  }
}
