import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Moving all localStorage related methods to this service for better maintainability and testability
  public setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
    }
  }

  public getItem<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (!value) {
      console.error(`Error getting item from localStorage: ${key}`);
      return null;
    } else {
      return JSON.parse(value);
    }
  }

  public removeItem(key: string): void {
    const value = localStorage.getItem(key);
    if (!value) {
      console.error(`Error removing item from localStorage: ${key} does not exist`);
      return;
    }
    localStorage.removeItem(key);
  }  
}
