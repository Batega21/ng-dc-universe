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
import { LocalStorageService } from '../core/services/local-storage.service';

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
    localStorageService: inject(LocalStorageService),
  })),

  withComputed((state) => ({
    sortedHeroes: computed(() =>
      state
        .heroes()
        .slice()
        .sort((a, b) => a.id - b.id)
    ),
  })),

  withMethods(({ logger, heroesService, localStorageService, ...store }) => ({
    getHeroesPaginated(page: number, limit: number): void {

      logger.log(`Fetching paginated Heroes page: ${page}, limit: ${limit}`);
      patchState(store, { loading: true });

      const storageHeroes = localStorageService.getCachePaginatedHeroes(page, limit);

      if (storageHeroes !== null && storageHeroes.heroesCount > 0) {
        logger.log('Heroes loaded from local storage');
        patchState(store, {
          heroes: storageHeroes.heroes,
          heroesCount: storageHeroes.heroesCount,
          loading: false,
          initialLoad: true,
          page: page,
          limit: limit,
        });
        return;
      }
      
      heroesService
        .getHeroesPaginated(page, limit)
        .pipe(delay(1000))
        .subscribe({
          next: (response: HeroesPaginated) => {
            patchState(store, {
              heroes: response.heroes,
              heroesCount: response.heroesCount,
              loading: false,
              initialLoad: true,
              page: page,
              limit: limit,
            });
            localStorageService.cacheHeroes(response);
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
            heroes: response.heroes,
            heroesCount: response.heroesCount,
            loading: false,
            initialLoad: true,
            page: Pagination.DEFAULT_PAGE,
            limit: Pagination.DEFAULT_LIMIT,
          });
          localStorage.setItem(
            'heroes',
            JSON.stringify({
              heroes: response.heroes,
              heroesCount: response.heroesCount,
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
