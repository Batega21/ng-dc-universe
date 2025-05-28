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

  it('should have a getHeroes method', () => {
    const store = TestBed.inject(HeroesStore);
    expect(store.getHeroes).toBeDefined();
  });

  it('should initialize the hero state', () => {
    const store = TestBed.inject(HeroesStore);

    store.getHeroes();

    expect(store.loading()).toBeTrue();
    expect(store.initialLoad()).toBeTrue();
    expect(store.heroes()).toEqual(HEROES);
    expect(store.heroesCount()).toBe(HEROES.length);
  });

  it('should fetch heroes and update the state', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    spyOn(localStorage, 'getItem').and.returnValues(
      null, // First call returns null (no heroes in localStorage)
      JSON.stringify(HEROES) // Second call returns the heroes
    );
    spyOn(localStorage, 'setItem').and.callThrough();

    store.getHeroes();

    tick(); // Simulate the passage of time for async operations

    expect(service.getHeroes).toHaveBeenCalled();
    expect(store.heroes()).toEqual(HEROES);
    expect(store.heroesCount()).toEqual(HEROES.length);
    expect(localStorage.getItem('heroes')).toBe(JSON.stringify(HEROES));
    expect(logger.log).toHaveBeenCalledWith('Fetching Heroes from API Service');
  }));

  it('should log "Heroes loaded from local storage" when load heroes from localStorage', () => {
    const store = TestBed.inject(HeroesStore);
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(HEROES));
    spyOn(localStorage, 'setItem').and.callThrough();

    store.getHeroes();

    expect(logger.log).toHaveBeenCalledWith('Heroes loaded from local storage');
  });

  it('should log "Error fetching heroes from API" when an error occurs', () => {
    const store = TestBed.inject(HeroesStore);
    const errorMessage = new Error('Error fetching heroes from API');
    (service.getHeroes as jasmine.Spy).and
      .returnValue(throwError(() => errorMessage));
    spyOn(localStorage, 'getItem').and.returnValue(null);

    store.getHeroes();

    expect(logger.error).toHaveBeenCalledWith(
      'Error fetching heroes from API:',
      errorMessage
    );
  });

  it('should fetch Heroes Paginated and update the state', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const pageIndex = Pagination.DEFAULT_PAGE;
    const pageSize = Pagination.DEFAULT_LIMIT;
    spyOn(localStorage, 'getItem').and.returnValues(
      null, // First call returns null (no heroes in localStorage)
      JSON.stringify(HEROES) // Second call returns the heroes
    );
    spyOn(localStorage, 'setItem').and.callThrough();

    store.getHeroesPaginated(pageIndex, pageSize);

    tick(); // Simulate the passage of time for async operations

    expect(service.getHeroesPaginated).toHaveBeenCalledWith(pageIndex, pageSize);
    expect(store.heroes()).toEqual(HEROES);
    expect(store.heroesCount()).toBe(HEROES.length);
  }
  ));

});
