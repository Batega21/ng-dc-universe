import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';
import { HEROES_MOCK } from '../constant/heroes.constant';
import { Pagination } from '../enums/pagination.enum';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set an item in localStorage', () => {
    const key = 'heroes';
    const value = { heroes: HEROES_MOCK, heroesCount: HEROES_MOCK.length };
    
    service.setHeroesInStorage(value);
    const storedValue = service.getLocalHeroes(key);
    
    expect(storedValue).toBeTruthy();
    expect(storedValue).toEqual(value);
  });

  it('should get an Heroes from localStorage', () => {
    const key = 'heroes';
    const heroes = HEROES_MOCK;
    const value = { heroes: heroes, heroesCount: HEROES_MOCK.length };

    localStorage.setItem(key, JSON.stringify(value));
    const paginatedHeroes = service.getHeroesFromStorage(Pagination.DEFAULT_PAGE, Pagination.DEFAULT_LIMIT);
    
    expect(paginatedHeroes).toBeTruthy();
    expect(paginatedHeroes?.heroes).toEqual(heroes.slice(0, Pagination.DEFAULT_LIMIT));
  });

  it('should return null if the item does not exist in localStorage', () => {
    const key = 'testKey';
    const retrievedValue = service.getLocalHeroes(key);

    expect(retrievedValue).toBeNull();
  });

  it('should remove a Hero from the local storage', () => {
    const heroId = 1;
    const key = 'heroes';
    const value = { heroes: HEROES_MOCK, heroesCount: HEROES_MOCK.length };

    service.setHeroesInStorage(value);
    service.removeHeroesFromStorage(heroId);

    const updatedHeroes = service.getLocalHeroes(key);
    const expectedHeroes = HEROES_MOCK.filter(hero => hero.id !== heroId);
    expect(updatedHeroes).toBeTruthy();
    expect(updatedHeroes?.heroes).toEqual(expectedHeroes);
    expect(updatedHeroes?.heroesCount).toBe(expectedHeroes.length);
    expect(localStorage.getItem(key)).toBe(JSON.stringify(updatedHeroes));
  });

  it('should not throw an error when removing a non-existent item from localStorage', () => {
    const heroId = 1;
    const key = 'nonExistentKey';
    
    expect(() => service.removeHeroesFromStorage(heroId)).not.toThrow();
    expect(localStorage.getItem(key)).toBeNull();
  });

  it('should clear all items from localStorage', () => {
    const key1 = 'testKey1';
    const value1 = { test: 'value1' };
    const key2 = 'testKey2';
    const value2 = { test: 'value2' };
    localStorage.setItem(key1, JSON.stringify(value1));
    localStorage.setItem(key2, JSON.stringify(value2));

    localStorage.clear();

    const removedValue1 = localStorage.getItem(key1);
    const removedValue2 = localStorage.getItem(key2);
    expect(removedValue1).toBeNull();
    expect(removedValue2).toBeNull();
    expect(localStorage.length).toBe(0);
  });


  it('should add a new hero to storage when heroes already exist', () => {
    const initial = { heroes: [...HEROES_MOCK], heroesCount: HEROES_MOCK.length };
    service.setHeroesInStorage(initial);
    const newHero = { id: 999, name: 'Extra Hero' };
    service.addHeroToStorage(newHero as any);
    const stored = service.getLocalHeroes('heroes');
    expect(stored?.heroes.length).toBe(initial.heroesCount + 1);
    expect(stored?.heroes.some(h => h.id === newHero.id)).toBeTrue();
    expect(stored?.heroesCount).toBe(initial.heroesCount + 1);
  });

  it('should not add a hero if hero with same id already exists', () => {
    const hero = HEROES_MOCK[0];
    const initial = { heroes: [...HEROES_MOCK], heroesCount: HEROES_MOCK.length };
    service.setHeroesInStorage(initial);
    spyOn(console, 'warn');
    service.addHeroToStorage(hero as any);
    const stored = service.getLocalHeroes('heroes');
    expect(stored?.heroes.length).toBe(initial.heroesCount);
    expect(console.warn).toHaveBeenCalledWith(`Hero with id ${hero.id} already exists in local storage.`);
  });

  it('should add a new hero to storage when no heroes exist', () => {
    const newHero = HEROES_MOCK[0];
    service.addHeroToStorage(newHero);
    service.setHeroesInStorage({ heroes: [newHero], heroesCount: 1 });
    const stored = service.getLocalHeroes('heroes');
    expect(stored).toBeTruthy();
    expect(stored?.heroes.length).toBe(1);
    expect(stored?.heroes[0].id).toBe(newHero.id);
    expect(stored?.heroesCount).toBe(1);
  });

  it('should return null from getHeroesFromStorage if no heroes in storage', () => {
    localStorage.clear();
    const result = service.getHeroesFromStorage(1, 10);
    expect(result).toBeNull();
  });

  it('should return paginated heroes from getHeroesFromStorage', () => {
    const value = { heroes: HEROES_MOCK, heroesCount: HEROES_MOCK.length };
    service.setHeroesInStorage(value);
    const page = 2;
    const pageSize = 2;
    const expected = HEROES_MOCK.slice((page - 1) * pageSize, page * pageSize);
    const result = service.getHeroesFromStorage(page, pageSize);
    expect(result).toBeTruthy();
    expect(result?.heroes).toEqual(expected);
    expect(result?.heroesCount).toBe(HEROES_MOCK.length);
  });

  it('should log error and return null if getLocalHeroes is called with missing key', () => {
    spyOn(console, 'error');
    const result = service.getLocalHeroes('missingKey');
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Error getting item from localStorage: missingKey');
  });

  it('should log warning if removeHeroesFromStorage is called when no heroes exist', () => {
    spyOn(console, 'warn');
    service.removeHeroesFromStorage(123);
    expect(console.warn).toHaveBeenCalledWith('No heroes found in local storage to remove with id: 123');
  });

});
