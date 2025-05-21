import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { TitleCasePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { Subscription } from 'rxjs';

import { Hero } from '../../../core/interfaces/hero';
import { LoggerService } from '../../../core/services/logger.service';
import { ButtonBackComponent } from '../../../shared/button-back/button-back.component';
import { HeroesProvider } from '../../../state/hero.store';

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
  private readonly route = inject(ActivatedRoute);
  private readonly logger = inject(LoggerService);
  private readonly store = inject(HeroesProvider);
  private subscription: Subscription | null = null;
  public hero: WritableSignal<Hero> = signal({} as Hero);

  ngOnInit() {
    const subscription = this.route.params.subscribe((params) => {
      if (params['id']) {
        this.logger.log('ID', params['id']);
        this.store.getHeroById(params['id']);
        this.hero.set(this.store.selectedHero());
        this.logger.log('HeroDetailComponent', this.hero().name);
      }
    });

    this.subscription = subscription;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
