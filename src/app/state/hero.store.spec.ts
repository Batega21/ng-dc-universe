import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HeroesStore } from './hero.store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroService } from '../core/services/hero.service';
import { LoggerService } from '../core/services/logger.service';
import { Hero, HeroesPaginated } from '../core/interfaces/hero';
import { of, throwError } from 'rxjs';
import { Pagination } from '../core/enums/pagination.enum';
import { HEROES_MOCK } from '../core/constant/heroes.constant';
import { LocalStorageService } from '../core/services/local-storage.service';

describe('HeroStore', () => {
  let service: HeroService;
  let logger: LoggerService;
  let localStorageService: LocalStorageService;

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
            addHero: jasmine
              .createSpy('addHero')
              .and.returnValue(of(HEROES_MOCK[0])),
            updateHero: jasmine
              .createSpy('updateHero')
              .and.returnValue(of(HEROES_MOCK[0])),
            deleteHero: jasmine
              .createSpy('deleteHero')
              .and.returnValue(of(HEROES_MOCK[0])),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jasmine.createSpy('log'),
            error: jasmine.createSpy('error'),
          },
        },
        {
          provide: LocalStorageService,
          useValue: {
            getHeroesFromStorage: jasmine
              .createSpy('getHeroesFromStorage')
              .and.returnValue(null),
            setHeroesInStorage: jasmine.createSpy('setHeroesInStorage'),
            getLocalHeroes: jasmine.createSpy('getLocalHeroes').and.returnValue(null),
            removeHeroesFromStorage: jasmine.createSpy('removeHeroesFromStorage'),
            addHeroToStorage: jasmine
              .createSpy('addHeroToStorage'),
          },
        }
      ],
    });
    service = TestBed.inject(HeroService);
    logger = TestBed.inject(LoggerService);
    localStorageService = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  it('should be created', () => {
    const store = TestBed.inject(HeroesStore);
    expect(store).toBeTruthy();
  });

  it('should fetch Heroes Paginated and update the state', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const pageIndex = Pagination.DEFAULT_PAGE;
    const pageSize = Pagination.DEFAULT_LIMIT;
    (service.getHeroesPaginated as jasmine.Spy).and
      .returnValue(of({ heroes: HEROES_MOCK, heroesCount: HEROES_MOCK.length }));

    store.getHeroesPaginated(pageIndex, pageSize);

    tick(1000);

    expect(service.getHeroesPaginated).toHaveBeenCalledWith(pageIndex, pageSize);
    expect(store.heroes()).toEqual(HEROES_MOCK.slice(pageIndex - 1, pageSize));
    expect(store.heroesCount()).toBe(HEROES_MOCK.length);

    expect(logger.log).toHaveBeenCalledWith(`Fetching paginated Heroes page: ${pageIndex}, limit: ${pageSize}`);
    expect(logger.log).toHaveBeenCalledWith('Heroes successfully fetched and saved to local storage.');
    }
  ));

  it('should handle error when getHeroesPaginated fails', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const pageIndex = Pagination.DEFAULT_PAGE;
    const pageSize = Pagination.DEFAULT_LIMIT;
    const errorMessage = new Error('Error fetching heroes from API');
    (service.getHeroesPaginated as jasmine.Spy).and.returnValue(throwError(() => errorMessage));

    store.getHeroesPaginated(pageIndex, pageSize);

    tick(1000);

    expect(logger.error).toHaveBeenCalledWith('Error fetching heroes from API', errorMessage);
  }));
  
  it('should fetch heroes by name and update the state', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const heroesName = ['Superman', 'Batman'];
    (localStorageService.getHeroesFromStorage as jasmine.Spy).and.returnValue(null);
    (service.getHeroesByNames as jasmine.Spy).and
      .returnValue(of({ heroes: HEROES_MOCK, totalCount: HEROES_MOCK.length }));

    store.getHeroesByNames(heroesName);

    tick(1000);
    
    expect(service.getHeroesByNames).toHaveBeenCalledWith(heroesName);
    expect(store).toBeTruthy();
  }));

  it('should handle error when getHeroesByNames fails', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const heroesName = ['Ironman', 'Wolverine'];
    const errorMessage = new Error('Error fetching heroes from API');
    (service.getHeroesByNames as jasmine.Spy).and.returnValue(throwError(() => errorMessage));

    store.getHeroesByNames(heroesName);

    tick(1000);

    expect(logger.error).toHaveBeenCalledWith('Error fetching heroes from API', errorMessage);
  }));

  it('should fetch a hero by Id from API', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const heroId = 1;
    (localStorageService.getHeroesFromStorage as jasmine.Spy).and.returnValue(null);
    (service.getHeroById as jasmine.Spy).and.returnValue(of(HEROES_MOCK[0]));

    store.getHeroById(heroId);
    tick(1000);

    expect(service.getHeroById).toHaveBeenCalledWith(heroId);
    expect(store.selectedHero()).toEqual(HEROES_MOCK[0]);
    expect(store).toBeTruthy();
  }));

  it('should handle error when getHeroById fails', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const heroId = HEROES_MOCK[0].id;
    const errorMessage = new Error('Error fetching hero by ID');
    (service.getHeroById as jasmine.Spy).and.returnValue(throwError(() => errorMessage));

    store.getHeroById(heroId);

    tick(1000);

    expect(logger.error).toHaveBeenCalledWith('Error fetching hero from API:', errorMessage);
  }));

  it('should add a hero and update the state', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const newHero: Hero = {
      id: HEROES_MOCK.length + 1,
      name: 'Test Hero',
      alias: 'Test Alias',
      powers: ['Super strength', 'Flight'],
      firstAppearance: '2025',
      alignment: 'Good',
      team: 'Justice League',
      realName: 'Test Real Name',
      origin: 'Test Origin',
      imageUrl: 'img/placeholder.jpg',
    };
    (service.addHero as jasmine.Spy).and.returnValue(of(newHero));

    store.addHero(newHero);
    tick(1000);

    expect(service.addHero).toHaveBeenCalledWith(newHero);
  }
  ));

  it('should handle error when addHero fails', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const hero = HEROES_MOCK[0];
    const errorMessage = new Error('Error adding hero');
    (service.addHero as jasmine.Spy).and.returnValue(throwError(() => errorMessage));

    store.addHero(hero);

    tick(1000);

    expect(logger.error).toHaveBeenCalledWith('Error adding hero to API', errorMessage);
  }));

  it('should update a hero and update the state', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const updatedHero: Hero = { ...HEROES_MOCK[0], name: 'Updated Hero' };
    (service.updateHero as jasmine.Spy).and.returnValue(of(updatedHero));

    store.updateHero(updatedHero);
    tick(1000);

    expect(service.updateHero).toHaveBeenCalledWith(updatedHero);
    expect(store.selectedHero()).toEqual(updatedHero);
  }));

  it('should handle error when updateHero fails', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const heroId = HEROES_MOCK[0].id;
    const errorMessage = new Error(`Hero with id ${heroId} deleted successfully`);
    (service.updateHero as jasmine.Spy).and.returnValue(throwError(() => errorMessage));

    store.updateHero(HEROES_MOCK[0]);

    tick(1000);

    expect(logger.error).toHaveBeenCalledWith('Error updating hero:', errorMessage);
  }));

  it('should delete a hero and update the state', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const heroId = HEROES_MOCK[0].id;

    let mockStorageData: { heroes: Hero[]; heroesCount: number } | null = JSON.parse(JSON.stringify({
      heroes: HEROES_MOCK,
      heroesCount: HEROES_MOCK.length,
    }));

    (service.deleteHero as jasmine.Spy).and.returnValue(of(null));
    (localStorageService.getLocalHeroes as jasmine.Spy).and.returnValue(mockStorageData);

    store.deleteHero(heroId);
    tick(1000);

    expect(service.deleteHero).toHaveBeenCalledWith(heroId);
    expect(localStorageService.removeHeroesFromStorage).toHaveBeenCalledWith(heroId);
    expect(localStorageService.getLocalHeroes).toHaveBeenCalledWith('heroes');
    expect(logger.log).toHaveBeenCalledWith(`Hero with id ${heroId} deleted successfully`);
  }));

  it('should handle error when deleteHero fails', fakeAsync(() => {
    const store = TestBed.inject(HeroesStore);
    const heroId = HEROES_MOCK[0].id;
    const errorMessage = new Error(`Hero with id ${heroId} deleted successfully`);
    (service.deleteHero as jasmine.Spy).and.returnValue(throwError(() => errorMessage));

    store.deleteHero(HEROES_MOCK[0].id);

    tick(1000);

    expect(logger.error).toHaveBeenCalledWith('Error deleting hero:', errorMessage);
  }));

});
