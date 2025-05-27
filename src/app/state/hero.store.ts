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
  selectedHero: Hero;
};

const initialState: heroesState = {
  heroes: [] as Hero[],
  loading: false,
  initialLoad: false,
  heroesCount: 0,
  page: Pagination.DEFAULT_PAGE,
  limit: Pagination.DEFAULT_LIMIT,
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
      const storageHeroes = JSON.parse(
        localStorage.getItem('heroes') || '{"heroes":[], "heroesCount":0}'
      );
      logger.log('getHeroById called with id:', id);
      patchState(store, { loading: true });
      if (storageHeroes.heroes?.length > 0) {
        logger.log('Heroes loaded from local storage');
        const hero = storageHeroes.heroes.find((hero: Hero) => hero.id == id);
        patchState(store, {
          selectedHero: hero,
          loading: false,
        });
        logger.log('Hero found:', hero);
      } else {
        logger.log('Fetching Hero from API Service');
        heroesService.getHeroById(id.toString()).subscribe({
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

    getHeroesPaginated(page: number, limit: number): void {
      const storageHeroes = JSON.parse(
        localStorage.getItem('heroes') || '{"heroes":[], "heroesCount":0}'
      );
      patchState(store, { loading: true });
      if (storageHeroes.heroes?.length > 0) {
        logger.log('Heroes loaded from local storage');
        patchState(store, {
          heroes: storageHeroes.heroes,
          heroesCount: storageHeroes.heroesCount,
          loading: false,
          initialLoad: true,
          page: page,
          limit: limit,
        });
      } else {
        logger.log(`Fetching Heroes with page: ${page}, limit: ${limit}`);
        heroesService.getHeroesPaginated(page, limit).subscribe({
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
            logger.error('Error fetching heroes from API:', err);
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

      localStorage.setItem('heroes', JSON.stringify({
        heroes: updatedHeroes,
        heroesCount: updatedHeroes.length,
      }));
      logger.log('Hero successfully deleted and local storage updated');
    },

    getHeroesByNames(heroes: string[]): void {

      logger.log('getHeroesByNames called with heroes:', heroes);
      const storageHeroes = JSON.parse(
        localStorage.getItem('heroes') || '{"heroes":[], "heroesCount":0}'
      );
      logger.log('Heroes loaded from local storage', storageHeroes);
      patchState(store, { loading: true });

      if (storageHeroes.heroes?.length > 0) {
        const filteredHeroes = storageHeroes.heroes.filter((hero: Hero) =>
          heroes.includes(hero.name)
        );
        logger.log('Filtered heroes:', filteredHeroes);
        storageHeroes.heroesCount = storageHeroes.heroes.length;

        if (filteredHeroes.length === heroes.length) {
          logger.log('All heroes found in local storage');
          patchState(store, {
            heroes: filteredHeroes,
            heroesCount: filteredHeroes.length,
            loading: false,
            initialLoad: true,
            page: Pagination.DEFAULT_PAGE,
            limit: Pagination.DEFAULT_LIMIT,
          });
        } else {
          logger.log('No heroes found in local storage, fetching from API');
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
              logger.error('Error fetching heroes from API:', err);
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
        }
      }
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
          localStorage.setItem('heroes', JSON.stringify({
            heroes: store.heroes(),
            heroesCount: store.heroesCount(),
          }));
        }
      });
    },

    onDestroy({ logger, heroesService, ...store }) {
      logger.log('HeroesProvider destroyed');
    },
  })
);
