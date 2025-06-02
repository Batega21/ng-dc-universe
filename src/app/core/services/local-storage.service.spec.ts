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

  it('should get an Item from localStorage', () => {
    const key = 'heroes';
    const startIndex = (Pagination.DEFAULT_PAGE - 1) * Pagination.DEFAULT_LIMIT;
    const paginatedValue = HEROES_MOCK.slice(startIndex, startIndex + Pagination.DEFAULT_LIMIT);
    const value = { heroes: paginatedValue, heroesCount: HEROES_MOCK.length };

    localStorage.setItem(key, JSON.stringify(value));
    const retrievedValue = service.getLocalHeroes(key);
    const paginatedHeroes = retrievedValue?.heroes?.slice(startIndex, startIndex + Pagination.DEFAULT_LIMIT);

    expect({
      heroes: paginatedHeroes,
      heroesCount: HEROES_MOCK.length
    }).toEqual(value);
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
});
