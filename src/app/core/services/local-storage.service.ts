import { Injectable } from '@angular/core';
import { Hero, HeroesPaginated } from '../interfaces/hero';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public getCachePaginatedHeroes(page: number, pageSize: number): HeroesPaginated | null {
    const localHeroes = this.getLocalHeroes('heroes') || { heroes: [], heroesCount: 0 };
    const startIndex = (page - 1) * pageSize;

    if (localHeroes.heroesCount > 0) {
      const heroes = localHeroes['heroes'].slice(startIndex, startIndex + pageSize);
      const cacheHeroes: HeroesPaginated = {
        heroes: heroes,
        heroesCount: localHeroes.heroesCount
      }
      return cacheHeroes;
    } else {
      return null;
    }
  }

  public cacheHeroes(heroData: HeroesPaginated): void {
    const key = 'heroes';
    const value: HeroesPaginated = {
      heroes: heroData.heroes,
      heroesCount: heroData.heroesCount,
    };
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getLocalHeroes(key: string): HeroesPaginated | null {
    const cachedHeroes = localStorage.getItem(key);
    if (!cachedHeroes) {
      console.error(`Error getting item from localStorage: ${key}`);
      return null;
    } else {
      return JSON.parse(cachedHeroes);
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

  // public localStorageManager(data: Hero[]): void {
  //   const localData = localStorage.getItem('heroes') || { heroes: [], heroesCount: 0 };

  //   if (data && data.length > 0) {
  //     data.forEach((hero: Hero) => {
  //       if (!localData.heroes.some((h: Hero) => h.id === hero.id)) {
  //         localData.heroes.push(hero);
  //         localData.heroesCount++;
  //       }
  //     })
  //     return;
  //   }
  //   return;
  // }
}
