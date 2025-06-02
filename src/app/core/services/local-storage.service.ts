import { Injectable } from '@angular/core';
import { Hero, HeroesPaginated } from '../interfaces/hero';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public getHeroesFromStorage(page: number, pageSize: number): HeroesPaginated | null {
    const localHeroes = this.getLocalHeroes('heroes') || { heroes: [], heroesCount: 0 };
    const startIndex = (page - 1) * pageSize;

    if (localHeroes.heroesCount > 0) {
      const heroes = localHeroes['heroes'].slice(startIndex, startIndex + pageSize);
      const setHeroesInStorage: HeroesPaginated = {
        heroes: heroes,
        heroesCount: localHeroes.heroesCount
      }
      return setHeroesInStorage;
    } else {
      return null;
    }
  }

  public setHeroesInStorage(heroData: HeroesPaginated): void {
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

  public removeHeroesFromStorage(id: number): void {
    const localHeroes = this.getLocalHeroes('heroes') || { heroes: [], heroesCount: 0 };
    if (localHeroes.heroesCount > 0) {
      const updatedHeroes = localHeroes.heroes.filter(hero => hero.id !== id);
      localHeroes.heroes = updatedHeroes;
      localHeroes.heroesCount = updatedHeroes.length;
      this.setHeroesInStorage(localHeroes);
    } else {
      console.warn(`No heroes found in local storage to remove with id: ${id}`);
    }
  }

  public addHeroToStorage(hero: Hero): void {
    const localHeroes = this.getLocalHeroes('heroes') || { heroes: [], heroesCount: 0 };
    if (localHeroes.heroesCount > 0) {
      const existingHero = localHeroes.heroes.find(h => h.id === hero.id);
      if (!existingHero) {
        localHeroes.heroes.push(hero);
        localHeroes.heroesCount++;
        this.setHeroesInStorage(localHeroes);
      } else {
        console.warn(`Hero with id ${hero.id} already exists in local storage.`);
      }
    } else {
      const newHeroes: HeroesPaginated = {
        heroes: [hero],
        heroesCount: 1
      };
      this.setHeroesInStorage(newHeroes);
    }
  }
}
