import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HeroesStore } from './hero.store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroService } from '../core/services/hero.service';
import { LoggerService } from '../core/services/logger.service';
import { Hero } from '../core/interfaces/hero';
import { of, throwError } from 'rxjs';
import { Pagination } from '../core/enums/pagination.enum';
import { HEROES } from '../core/constant/heroes.constant';

describe('HeroStore', () => {
  let service: HeroService;
  let logger: LoggerService;

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
              .and.returnValue(of(HEROES)),
            getHeroById: jasmine
              .createSpy('getHeroById')
              .and.returnValue(of(HEROES[0])),
            getHeroesPaginated: jasmine
              .createSpy('getHeroesPaginated')
              .and.returnValue(
                of({
                  heroes: HEROES,
                  totalCount: HEROES.length,
                })
              ),
            getHeroesByQueryParams: jasmine
              .createSpy('getHeroesByQueryParams')
              .and.returnValue(of(HEROES)),
            getHeroesByNames: jasmine
              .createSpy('getHeroesByNames')
              .and.returnValue(
                of({
                  heroes: (HEROES as Hero[]).slice(0, Pagination.DEFAULT_LIMIT),
                  totalCount: HEROES.length,
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

  it('should fetch heroes with getHeroes() and update the state', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem').and.callThrough();
    (service.getHeroes as jasmine.Spy).and.returnValue(of(HEROES));

    store.getHeroes();

    tick(3000);

    expect(service.getHeroes).toHaveBeenCalled();
    expect(store.heroes()).toEqual(HEROES);
    expect(store.heroesCount()).toEqual(HEROES.length);
    expect(logger.log).toHaveBeenCalledWith('Fetching Heroes from API Service');
  }));

  it('should loaded heroes from local storage if any', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const heroes = HEROES;
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(heroes));
    spyOn(localStorage, 'setItem');

    store.getHeroes();

    tick(0);

    expect(logger.log).toHaveBeenCalledWith('Heroes loaded from local storage');
    expect(store.heroesCount()).toBe(heroes.length);
    expect(store.loading()).toBeFalse();
    expect(store.initialLoad()).toBeTrue();
  }));

  it('should handle error when fetching from API', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const errorMessage = 'Error fetching heroes from API';

    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem').and.callThrough();
    (service.getHeroes as jasmine.Spy).and
      .returnValue(throwError(() => new Error(errorMessage)));

    store.getHeroes();

    tick(1000);

    expect(logger.error).toHaveBeenCalledWith(
      errorMessage,
      new Error(errorMessage)
    );
    expect(store.heroes()).toBeUndefined();
    expect(store.loading()).toBeFalse();
    expect(store.initialLoad()).toBeTrue();
  }));

  // it('should fetch Heroes Paginated and update the state', fakeAsync(() => {
  //   const store = TestBed.inject(HeroesStore);
  //   const pageIndex = Pagination.DEFAULT_PAGE;
  //   const pageSize = Pagination.DEFAULT_LIMIT;
  //   spyOn(localStorage, 'getItem').and.returnValue(null);
  //   spyOn(localStorage, 'setItem').and.callThrough();
  //   (service.getHeroesPaginated as jasmine.Spy).and
  //     .returnValue(of({ heroes: HEROES, totalCount: HEROES.length }));

  //   store.getHeroesPaginated(pageIndex, pageSize);

  //   tick(1000);

  //   expect(service.getHeroesPaginated).toHaveBeenCalledWith(pageIndex, pageSize);
  //   expect(store.heroes()).toEqual(HEROES.slice(0, pageSize));
  //   expect(store.heroesCount()).toBe(HEROES.length);
  //   }
  // ));

  it('should handle error when fetching Paginated Heroes from API', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const errorMessage = 'Error fetching heroes from API';
    const pageIndex = Pagination.DEFAULT_PAGE;
    const pageSize = Pagination.DEFAULT_LIMIT;
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem').and.callThrough();
    (service.getHeroesPaginated as jasmine.Spy).and
      .returnValue(throwError(() => new Error(errorMessage)));

    store.getHeroesPaginated(pageIndex, pageSize);

    tick(1000);

    expect(logger.error).toHaveBeenCalledWith(
      errorMessage,
      new Error(errorMessage)
    );
    expect(store.heroes()).toBeUndefined();
    expect(store.loading()).toBeFalse();
    expect(store.initialLoad()).toBeTrue();
  }));

  // it('should get heroes by names and update the state', fakeAsync(() => {
  //   const store = TestBed.inject(HeroesStore);
  //   const names = HEROES.map(hero => hero.name);
  //   spyOn(localStorage, 'getItem').and.returnValues(null);
  //   spyOn(localStorage, 'setItem').and.callThrough();
  //   (service.getHeroesByNames as jasmine.Spy).and
  //     .returnValue(of({ heroes: HEROES.slice(0, Pagination.DEFAULT_LIMIT), totalCount: HEROES.length }));

  //   store.getHeroesByNames(names);

  //   tick();

  //   expect(service.getHeroesByNames).toHaveBeenCalledWith(names);
  //   expect(store.heroes()).toEqual(HEROES.slice(0, Pagination.DEFAULT_LIMIT));
  //   expect(store.heroesCount()).toBe(HEROES.length);
  // }));

  // it('should handle error when fetching Heroes with getHeroesByNames() from API', fakeAsync(() => {
  //   const store = TestBed.inject(HeroesStore);
  //   const errorMessage = 'Error fetching heroes from API';
  //   spyOn(localStorage, 'getItem').and.returnValue(null);
  //   spyOn(localStorage, 'setItem').and.callThrough();
  //   (service.getHeroesByNames as jasmine.Spy).and
  //     .returnValue(throwError(() => new Error(errorMessage)));

  //   store.getHeroesByNames(['Superman', 'Batman']);

  //   tick(1000);

  //   expect(logger.error).toHaveBeenCalledWith(
  //     errorMessage,
  //     new Error(errorMessage)
  //   );
  //   expect(store.heroes()).toBeUndefined();
  //   expect(store.loading()).toBeFalse();
  //   expect(store.initialLoad()).toBeTrue();
  // }));

});
