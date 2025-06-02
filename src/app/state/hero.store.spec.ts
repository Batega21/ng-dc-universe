import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HeroesStore } from './hero.store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroService } from '../core/services/hero.service';
import { LoggerService } from '../core/services/logger.service';
import { Hero } from '../core/interfaces/hero';
import { of, throwError } from 'rxjs';
import { Pagination } from '../core/enums/pagination.enum';
import { HEROES_MOCK } from '../core/constant/heroes.constant';
import { LocalStorageService } from '../core/services/local-storage.service';

describe('HeroStore', () => {
  let service: HeroService;
  let logger: LoggerService;
  let localStorage: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: HeroesStore,
          useClass: HeroesStore,
        },
        {
          provide: HeroService,
          useValue: {
            getHeroes: jasmine
              .createSpy('getHeroes')
              .and.returnValue(of(HEROES_MOCK)),
            getHeroById: jasmine
              .createSpy('getHeroById')
              .and.returnValue(of(HEROES_MOCK[0])),
            getHeroesPaginated: jasmine
              .createSpy('getHeroesPaginated')
              .and.returnValue(
                of({
                  heroes: HEROES_MOCK,
                  totalCount: HEROES_MOCK.length,
                })
              ),
            getHeroesByQueryParams: jasmine
              .createSpy('getHeroesByQueryParams')
              .and.returnValue(of(HEROES_MOCK)),
            getHeroesByNames: jasmine
              .createSpy('getHeroesByNames')
              .and.returnValue(
                of({
                  heroes: (HEROES_MOCK as Hero[]).slice(0, Pagination.DEFAULT_LIMIT),
                  totalCount: HEROES_MOCK.length,
                })
              ),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jasmine.createSpy('log'),
            error: jasmine.createSpy('error'),
          },
        },
      ],
    });
    service = TestBed.inject(HeroService);
    logger = TestBed.inject(LoggerService);
    localStorage = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    const store = TestBed.inject(HeroesStore);
    expect(store).toBeTruthy();
  });

  it('should initialize the hero state', () => {
    const store = TestBed.inject(HeroesStore);
    expect(store.loading()).toBeTrue();
    expect(store.initialLoad()).toBeFalse();
    expect(store.heroes()).toEqual([]);
    expect(store.heroesCount()).toBe(0);
  });

  it('should fetch Heroes Paginated and update the state', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const pageIndex = Pagination.DEFAULT_PAGE;
    const pageSize = Pagination.DEFAULT_LIMIT;
    spyOn(localStorage, 'getCachePaginatedHeroes').and.returnValue(null);
    (service.getHeroesPaginated as jasmine.Spy).and
      .returnValue(of({ heroes: HEROES_MOCK, heroesCount: HEROES_MOCK.length }));

    store.getHeroesPaginated(pageIndex, pageSize);

    tick(1000);

    expect(service.getHeroesPaginated).toHaveBeenCalledWith(pageIndex, pageSize);
    expect(store.heroes()).toEqual(HEROES_MOCK.slice(0, pageSize));
    expect(store.heroesCount()).toBe(HEROES_MOCK.length);
    }
  ));

  // it('should handle error when fetching Paginated Heroes from API', fakeAsync(() => {
  //   const store = TestBed.inject(HeroesStore);
  //   const errorMessage = 'Error fetching heroes from API';
  //   const pageIndex = Pagination.DEFAULT_PAGE;
  //   const pageSize = Pagination.DEFAULT_LIMIT;
  //   spyOn(localStorage, 'getItem').and.returnValue(null);
  //   spyOn(localStorage, 'setItem').and.callThrough();
  //   (service.getHeroesPaginated as jasmine.Spy).and
  //     .returnValue(throwError(() => new Error(errorMessage)));

  //   store.getHeroesPaginated(pageIndex, pageSize);

  //   tick(1000);

  //   expect(logger.error).toHaveBeenCalledWith(
  //     errorMessage,
  //     new Error(errorMessage)
  //   );
  //   expect(store.heroes()).toBeUndefined();
  //   expect(store.loading()).toBeFalse();
  //   expect(store.initialLoad()).toBeTrue();
  // }));
  
  // TODO complete the test for getHeroById
  it('should feth heroes by name and update the state', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    expect(store).toBeTruthy();
  }));

  it('should handle error when fetching heroes by name from API', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    expect(store).toBeTruthy();
  }));

});
