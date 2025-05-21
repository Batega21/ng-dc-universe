import { inject, Injectable } from '@angular/core';
import { Hero } from '../interfaces/hero';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private http = inject(HttpClient);
  private readonly _heroesApi = `http://localhost:3000`;

  constructor() {}

  getHeroById(id: string): Observable<Hero> {
    return this.http.get<Hero>(`${this._heroesApi}/superhero/${id}`);
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this._heroesApi}/superheroes`);
  }
}
