import { computed, effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';

import { Hero, HeroesPaginated } from '../core/interfaces/hero';
import { HeroService } from '../core/services/hero.service';
import { LoggerService } from '../core/services/logger.service';
import { delay } from 'rxjs';

// Sources:
// https://ngrx.io/guide/signals/signal-store
// https://www.telerik.com/blogs/state-management-angular-applications-using-ngrx-signals-store

type heroesState = {
  heroes: Hero[];
  loading: boolean;
  initialLoad: boolean;
  heroesCount: number;
  selectedHero: Hero;
};

const initialState: heroesState = {
  heroes: [] as Hero[],
  loading: false,
  initialLoad: false,
  heroesCount: 0,
  selectedHero: {} as Hero,
};

export const HeroesProvider = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withProps(() => ({
    heroesService: inject(HeroService),
    logger: inject(LoggerService),
  })),

  withComputed((state) => ({
    sortedHeroes: computed(() =>
      state
        .heroes()
        .slice()
        .sort((a, b) => a.id - b.id)
    ),
  })),

  withMethods(({ logger, heroesService, ...store }) => ({
    getHeroes(): void {
      const storageHeroes = JSON.parse(localStorage.getItem('heroes') || '[]');
      patchState(store, { loading: true });
      if (storageHeroes.length > 0) {
        logger.log('Heroes loaded from local storage');
        patchState(store, {
          heroes: storageHeroes,
          heroesCount: storageHeroes.length,
          loading: false,
          initialLoad: true,
        });
      } else {
        logger.log('Fetching Heroes from API Service');
        heroesService.getHeroes()
          .pipe(delay(1000))
          .subscribe({
          next: (heroes: Hero[]) => {
            patchState(store, {
              heroes: heroes,
              heroesCount: heroes.length,
              loading: false,
              initialLoad: true,
            });
            localStorage.setItem('heroes', JSON.stringify(heroes));
            logger.log(
              'Heroes successfully fetched and saved to local storage.'
            );
          },
          error: (err) => {
            logger.error('Error fetching heroes from API:', err);
            patchState(store, {
              heroes: [],
              heroesCount: 0,
              loading: false,
              initialLoad: false,
            });
          },
        });
      }
    },

    getHeroById(id: number): void {
      logger.log('getHeroById called with id:', id);
      patchState(store, { loading: true });
      if (store.initialLoad()) {
        const hero = store.heroes().find((hero) => hero.id == id);
        logger.log(`${hero?.name} found with id: ${id}`);
        
        if (!hero) {
          console.error('Hero not found');
          patchState(store, { loading: false });
        } else {
          patchState(store, {
            selectedHero: hero,
            loading: false,
          });
          logger.log('Hero found:', hero);
        }
      }
    },

    getHeroesPaginated(page: number, limit: number): void {
      const storageHeroes = JSON.parse(localStorage.getItem(`heroes-${page}`) || '[]');
      patchState(store, { loading: true });
      if (storageHeroes.length > 0) {
        logger.log('Heroes loaded from local storage');
        patchState(store, {
          heroes: storageHeroes,
          heroesCount: storageHeroes.length,
          loading: false,
          initialLoad: true,
        });
        return;
      } else {
        logger.log(`Fetching Heroes with page: ${page}, limit: ${limit}`);
        heroesService.getHeroesPaginated(page, limit).subscribe({
          next: (response: HeroesPaginated) => {
            patchState(store, {
              heroes: response.data,
              heroesCount: response.totalHeroes,
              loading: false,
              initialLoad: true,
            });
            localStorage.setItem(`heroes-${page}`, JSON.stringify(response.data));
            logger.log(
              'Heroes successfully fetched and saved to local storage.'
            );
          },
          error: (err) => {
            logger.error('Error fetching heroes from API:', err);
            patchState(store, {
              heroes: [],
              heroesCount: 0,
              loading: false,
              initialLoad: false,
            });
          },
        });
      }
    },

    addHero(hero: Hero): Hero | null {
      patchState(store, { loading: true });
      const heroes = [...store.heroes(), hero];
      patchState(store, {
        heroes: heroes,
        loading: false,
      });
      logger.log('Hero added');
      return store.heroes().find((h) => h.id === hero.id) || null;
    },

    updateHero(hero: Hero | null): void {
      patchState(store, { loading: true });
      logger.log('Heroes updated from local storage with hero:', hero);

      const heroes = store.heroes().map((heroUpdated) => {
        if (heroUpdated.id === hero?.id) {
          patchState(store, {
            selectedHero: hero,
          });
          logger.log('Hero updated', hero);
          return { ...hero };
        }
        return heroUpdated;
      });

      patchState(store, {
        heroes: heroes,
      });
      logger.log('Hero updated');
      logger.log('SelectedHero updated', store.selectedHero());
      patchState(store, { loading: false });
    },

    deleteSelectedHero(id: number): void {
      patchState(store, { loading: true });

      const selectedHero = store.heroes().find((hero) => hero.id === id);
      if (!selectedHero) {
        logger.error('Hero not found', id);
        patchState(store, { loading: false });
        return;
      }
      const updatedHeroes = store.heroes().filter((hero) => hero.id !== id);
      patchState(store, {
        heroes: [...updatedHeroes],
        loading: false,
      });

      localStorage.setItem('heroes', JSON.stringify(updatedHeroes));
      logger.log('Hero successfully deleted and local storage updated');
    },
  })),

  withHooks({
    onInit({ logger, heroesService, ...store }) {
      logger.log('🚀 initialLoad:', store.initialLoad());
      store.getHeroesPaginated(1, 10);
      effect(() => {
        if (store.initialLoad()) {
          localStorage.setItem('heroes', JSON.stringify(store.heroes()));
        }
      });
    },

    onDestroy({ logger, heroesService, ...store }) {
      logger.log('HeroesProvider destroyed');
      const subscription = heroesService.getHeroes().subscribe();
      subscription.unsubscribe();
    },
  })
);
