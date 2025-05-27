import { TestBed } from "@angular/core/testing";
import { HeroesProvider } from "./hero.store";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { HeroService } from "../core/services/hero.service";
import { LoggerService } from "../core/services/logger.service";
import { Hero } from "../core/interfaces/hero";

describe('HeroStore', () => {
  let store: any;
  let _logger: any;
  let service: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroesProvider,
        {
          provide: HeroService,
          useValue: jasmine.createSpyObj('HeroesService', [
            'getHeroes', 'getHeroById', 'addHero', 'updateHero', 'deleteHero'
          ])
        },
        {
          provide: LoggerService,
          useValue: jasmine.createSpyObj('LoggerService', ['log', 'error', 'warn'])
        },
      ]
    });

    store = TestBed.inject(HeroesProvider);
    service = TestBed.inject(HeroService);
    _logger = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should have a getHeroes method', () => {
    expect(store.getHeroes).toBeDefined();
  });
  
  it('should initialize the hero state', () => {
    expect(store.initialState.heroes).toEqual([]);
    expect(store.initialState.loading).toBeFalse();
    expect(store.initialState.initialLoad).toBeFalse();
    expect(store.initialState.heroesCount).toBe(0);
    expect(store.initialState.page).toBe(1);
    expect(store.initialState.limit).toBe(9);
    expect(store.initialState.selectedHero).toEqual({} as Hero);
  });
}
);