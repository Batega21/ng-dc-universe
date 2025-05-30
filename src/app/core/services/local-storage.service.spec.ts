import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set an item in localStorage', () => {
    const key = 'testKey';
    const value = { test: 'value' };
    
    service.setItem(key, value);
    const storedValue = localStorage.getItem(key);
    
    expect(storedValue).toBeTruthy();
    expect(JSON.parse(storedValue!)).toEqual(value);
  });

  it('should throw an error when setting an item in localStorage fails', () => {
    localStorage.clear();
    const key = 'testKey';
    const value = { test: 'value' };
    spyOn(localStorage, 'setItem').and.throwError('Storage error');

    expect(() => service.setItem(key, value)).not.toThrow();
    expect(localStorage.getItem(key)).toEqual(null);
  });

  it('should get an Item from localStorage', () => {
    const key = 'testKey';
    const value = { test: 'value' };

    localStorage.setItem(key, JSON.stringify(value));
    const retrievedValue = service.getItem<{ test: string }>(key);

    expect(retrievedValue).toEqual(value);
  });

  it('should return null if the item does not exist in localStorage', () => {
    localStorage.clear();
    const key = 'testKey';
    const retrievedValue = service.getItem(key);

    spyOn(service, 'getItem').and.throwError('Item not found');

   expect(retrievedValue).toBeNull();
  });

  it('should remove an Item from localStorage', () => {
    const key = 'testKey';
    const value = { test: 'value' };

    localStorage.setItem(key, JSON.stringify(value));
    service.removeItem(key);
    const removedValue = localStorage.getItem(key);
    
    expect(removedValue).toBeNull();
  });

  it('should clear all items from localStorage', () => {
    const key1 = 'testKey1';
    const value1 = { test: 'value1' };
    const key2 = 'testKey2';
    const value2 = { test: 'value2' };
    localStorage.setItem(key1, JSON.stringify(value1));
    localStorage.setItem(key2, JSON.stringify(value2));
    service.clear();
    const removedValue1 = localStorage.getItem(key1);
    const removedValue2 = localStorage.getItem(key2);
    expect(removedValue1).toBeNull();
    expect(removedValue2).toBeNull();
    expect(localStorage.length).toBe(0);
  });
});
