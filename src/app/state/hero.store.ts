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
import { delay } from 'rxjs';
import { Pagination } from '../core/enums/pagination.enum';
import { LocalStorageService } from '../core/services/local-storage.service';

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

  withMethods(({ heroesService, localStorageService, ...store }) => ({
    getHeroesPaginated(page: number, limit: number): void {
      patchState(store, { loading: true, error: null });
      
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
              error: null,
            });
            localStorageService.setHeroesInStorage(response);
          },
          error: (err) => {
            patchState(store, {
              heroes: [],
              heroesCount: 0,
              loading: false,
              initialLoad: false,
              page: Pagination.DEFAULT_PAGE,
              limit: Pagination.DEFAULT_LIMIT,
              error: `Error fetching heroes from API: ${err}`,
              selectedHero: null,
            });
          },
        });
    },

    getHeroesByNames(heroes: string[]): void {
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
        },
        error: (err) => {
          patchState(store, {
              heroes: [],
              heroesCount: 0,
              loading: false,
              initialLoad: false,
              page: Pagination.DEFAULT_PAGE,
              limit: Pagination.DEFAULT_LIMIT,
              error: `Error fetching heroes from API: ${err}`,
              selectedHero: null,
          });
        },
      });
    },

    getHeroById(id: number): void {
      patchState(store, { loading: true });
      const storageHeroes = JSON.parse(
        localStorage.getItem('heroes') || '{"heroes":[], "heroesCount":0}'
      );

      if (storageHeroes.heroes?.length > 0) {
      const heroLocal = storageHeroes.heroes.find((hero: Hero) => hero.id == id);
        patchState(store, {
          selectedHero: heroLocal,
          loading: false,
        });
      } else {
        heroesService
          .getHeroById(id)
          .pipe(delay(1000))
          .subscribe({
            next: (hero: Hero) => {
              patchState(store, {
                selectedHero: hero,
                loading: false,
              });
            },
            error: (err) => {
              patchState(store, {
              loading: false,
              initialLoad: false,
              selectedHero: null,
              error: `Error fetching hero from API: ${err}`,
            });
            },
          });
      }
    },

    addHero(hero: Hero): void {
      patchState(store, { loading: true, error: null });

      heroesService.addHero(hero).subscribe({
        next: (addedHero: Hero) => {
          patchState(store, {
            heroes: [...store.heroes(), addedHero],
            heroesCount: store.heroesCount() + 1,
            selectedHero: addedHero,
            initialLoad: false,
            loading: false,
            error: null,
          });
          localStorageService.addHeroToStorage(addedHero);
        },
        error: (err) => {
          patchState(store, {
            loading: false,
            initialLoad: false,
            selectedHero: null,
            error: `Error adding hero: ${err}`,
          });
        },
      });
    },

    updateHero(hero: Hero): void {
      patchState(store, { loading: true, error: null });
      const storageHeroes = localStorageService
        .getHeroesFromStorage(
          Pagination.DEFAULT_PAGE,
          Pagination.DEFAULT_LIMIT);

      heroesService
        .updateHero(hero)
        .pipe(delay(1000))
        .subscribe({
          next: (updatedHero: Hero) => {
            const updatedHeroes = storageHeroes?.heroes.map((hero: Hero) =>
              hero.id === updatedHero.id ? updatedHero : hero
            );
            patchState(store, {
              heroes: updatedHeroes,
              selectedHero: updatedHero,
              heroesCount: storageHeroes?.heroesCount || 0,
              loading: false,
              initialLoad: false,
              error: null,
            });
          },
          error: (err) => {
            patchState(store, {
              loading: false,
              initialLoad: false,
              selectedHero: null,
              error: `Error updating hero: ${err}`
            });
          },
        });
    },

    deleteHero(id: number): void {
      patchState(store, { loading: true, error: null });

      heroesService
        .deleteHero(id)
        .pipe(delay(1000))
        .subscribe({
          next: () => {
            localStorageService.removeHeroesFromStorage(id);
            const updatedHeroes = localStorageService.getLocalHeroes('heroes');
            patchState(store, {
              heroes: updatedHeroes?.heroes || [],
              heroesCount: updatedHeroes?.heroesCount || 0,
              selectedHero: {} as Hero,
              initialLoad: false,
              loading: false,
              error: null,
            });
          },
          error: (err) => {
            patchState(store, {
              loading: false,
              initialLoad: false,
              selectedHero: null,
              error: `Error deleting hero: ${err}`
            });
          },
        });
    },
  })),

  withHooks({
    onInit({ heroesService, ...store }) {
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
  })
);
