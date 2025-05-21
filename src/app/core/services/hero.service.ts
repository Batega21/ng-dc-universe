import { inject, Injectable } from '@angular/core';
import { Hero, HeroesPaginated } from '../interfaces/hero';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getHeroesPaginated(
    page: number,
    limit: number
  ): Observable<HeroesPaginated> {
    const baseParams = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<HeroesPaginated>(`${this._heroesApi}/superheroes/pagination`, {
      params: baseParams,
    });
  }
}
