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
import { Pagination } from '../core/enums/pagination.enum';

// Sources:
// https://ngrx.io/guide/signals/signal-store
// https://www.telerik.com/blogs/state-management-angular-applications-using-ngrx-signals-store

type heroesState = {
  heroes: Hero[];
  loading: boolean;
  initialLoad: boolean;
  heroesCount: number;
  page: number;
  limit: number;
  selectedHero: Hero | null;
  error: string | null;
};

const initialState: heroesState = {
  heroes: [] as Hero[],
  loading: false,
  initialLoad: false,
  heroesCount: 0,
  page: Pagination.DEFAULT_PAGE,
  limit: Pagination.DEFAULT_LIMIT,
  selectedHero: null,
  error: null,
};

export const HeroesStore = signalStore(
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
      // TODO move to localStorageService
      const storageHeroes = JSON.parse(
        localStorage.getItem('heroes') || '{"heroes":[], "heroesCount":0}'
      );
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
        heroesService
          .getHeroes()
          .pipe(delay(1000))
          .subscribe({
            next: (heroes: Hero[]) => {
              patchState(store, {
                heroes: heroes,
                heroesCount: heroes.length,
                loading: false,
                initialLoad: true,
              });
              localStorage.setItem(
                'heroes',
                JSON.stringify({
                  heroes: heroes,
                  heroesCount: heroes.length,
                })
              );
              logger.log(
                'Heroes successfully fetched and saved to local storage.'
              );
            },
            error: (err) => {
              logger.error('Error fetching heroes from API', err);
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

    getHeroesPaginated(page: number, limit: number): void {
      logger.log(`Fetching Heroes with page: ${page}, limit: ${limit}`);
      patchState(store, { loading: true });
      heroesService
        .getHeroesPaginated(page, limit)
        .pipe(delay(1000))
        .subscribe({
          next: (response: HeroesPaginated) => {
            patchState(store, {
              heroes: response.data,
              heroesCount: response.totalHeroes,
              loading: false,
              initialLoad: true,
              page: page,
              limit: limit,
            });
            localStorage.setItem(
              'heroes',
              JSON.stringify({
                heroes: response.data,
                heroesCount: response.totalHeroes,
              })
            );
            logger.log(
              'Heroes successfully fetched and saved to local storage.'
            );
          },
          error: (err) => {
            logger.error('Error fetching heroes from API', err);
            patchState(store, {
              heroes: [],
              heroesCount: 0,
              loading: false,
              initialLoad: false,
              page: Pagination.DEFAULT_PAGE,
              limit: Pagination.DEFAULT_LIMIT,
            });
          },
        });
    },

    getHeroesByNames(heroes: string[]): void {
      logger.log('Fetching Heroes by names from API Service');
      patchState(store, { loading: true });

      heroesService.getHeroesByNames(heroes).subscribe({
        next: (response: HeroesPaginated) => {
          patchState(store, {
            heroes: response.data,
            heroesCount: response.totalHeroes,
            loading: false,
            initialLoad: true,
            page: Pagination.DEFAULT_PAGE,
            limit: Pagination.DEFAULT_LIMIT,
          });
          localStorage.setItem(
            'heroes',
            JSON.stringify({
              heroes: response.data,
              heroesCount: response.totalHeroes,
            })
          );
          logger.log(
            'Heroes successfully fetched from API and saved to local storage.'
          );
        },
        error: (err) => {
          logger.error('Error fetching heroes from API', err);
          patchState(store, {
            heroes: [],
            heroesCount: 0,
            loading: false,
            initialLoad: false,
            page: Pagination.DEFAULT_PAGE,
            limit: Pagination.DEFAULT_LIMIT,
          });
        },
      });
    },

    getHeroById(id: number): void {
      patchState(store, { loading: true });
      const storageHeroes = JSON.parse(
        localStorage.getItem('heroes') || '{"heroes":[], "heroesCount":0}'
      );
      logger.log('getHeroById called with id:', id);

      if (storageHeroes.heroes?.length > 0) {
      const heroLocal = storageHeroes.heroes.find((hero: Hero) => hero.id == id);
        logger.log('Heroes loaded from local storage');
        patchState(store, {
          selectedHero: heroLocal,
          loading: false,
        });
        logger.log('Hero found:', heroLocal);
      } else {
        logger.log('Fetching Hero from API Service');
        heroesService
          .getHeroById(id)
          .pipe(delay(1000))
          .subscribe({
            next: (hero: Hero) => {
              patchState(store, {
                selectedHero: hero,
                loading: false,
              });
              logger.log('Hero found:', hero);
            },
            error: (err) => {
              logger.error('Error fetching hero from API:', err);
              patchState(store, { loading: false });
            },
          });
      }
    },

    addHero(hero: Hero): void {
      logger.log('addHero called with hero:', hero);
      patchState(store, { loading: true });

      const storageHeroes = JSON.parse(
        localStorage.getItem('heroes') || '{"heroes":[], "heroesCount":0}'
      );

      heroesService.addHero(hero).subscribe({
        next: (addedHero: Hero) => {
          logger.log('Hero added successfully:', addedHero);
          patchState(store, { loading: false });
        },
        error: (err) => {
          logger.error('Error adding hero:', err);
          patchState(store, { loading: false });
        },
      });
    },

    updateHero(hero: Hero | null): void {
      patchState(store, { loading: true });
      logger.log('Heroes updated from local storage with hero:', hero);

      const storageHeroes = JSON.parse(
        localStorage.getItem('heroes') || '{"heroes":[], "heroesCount":0}'
      );
      const localHero = storageHeroes.heroes.find(
        (h: Hero) => h.id === hero?.id
      );

      if (!hero) {
        logger.error('Hero is null or undefined', hero);
        patchState(store, { loading: false });
        return;
      }
      heroesService
        .updateHero(hero)
        .pipe(delay(1000))
        .subscribe({
          next: (updatedHero: Hero) => {
            if (localHero) {
              logger.log('Update Hero in local storage, updating...');
              const updatedHeroes = storageHeroes.heroes.map((h: Hero) =>
                h.id === updatedHero.id ? updatedHero : h
              );
              patchState(store, {
                heroes: updatedHeroes,
                selectedHero: updatedHero,
                loading: false,
              });
            }

            logger.log('Hero updated successfully:', updatedHero);
            patchState(store, { loading: false });
          },
          error: (err) => {
            logger.error('Error updating hero:', err);
            patchState(store, { loading: false });
          },
        });
    },

    deleteSelectedHero(id: number): void {
      patchState(store, { loading: true });
      logger.log('deleteSelectedHero called with id:', id);
      heroesService
        .deleteHero(id)
        .pipe(delay(1000))
        .subscribe({
          next: () => {
            logger.log(`Hero with id ${id} deleted successfully`);
            patchState(store, {
              heroes: store.heroes().filter((hero) => hero.id !== id),
              heroesCount: store.heroesCount() - 1,
              loading: false,
              selectedHero: {} as Hero,
            });
          },
          error: (err) => {
            logger.error('Error deleting hero:', err);
            patchState(store, { loading: false });
          },
        });
    },
  })),

  withHooks({
    onInit({ logger, heroesService, ...store }) {
      store.getHeroesPaginated(
        Pagination.DEFAULT_PAGE,
        Pagination.DEFAULT_LIMIT
      );
      effect(() => {
        if (store.initialLoad()) {
          localStorage.setItem(
            'heroes',
            JSON.stringify({
              heroes: store.heroes(),
              heroesCount: store.heroesCount(),
            })
          );
        }
      });
    },

    onDestroy({ logger, heroesService, ...store }) {
      logger.log('HeroesProvider destroyed');
    },
  })
);
