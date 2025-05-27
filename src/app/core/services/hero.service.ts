import { inject, Injectable } from '@angular/core';
import { Hero, HeroesPaginated } from '../interfaces/hero';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Pagination } from '../enums/pagination.enum';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private http = inject(HttpClient);
  private readonly _heroesApi = `http://localhost:3000`;

  constructor() {}

  // Fetch Data operations
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

  getHeroesByQueryParams(queryName: string): Observable<Hero[]> {
    const params = new HttpParams().set('name', queryName);
    return this.http.get<Hero[]>(`${this._heroesApi}/superheroes/search`, {
      params,
    });
  }

  getHeroesByNames(names: string[]): Observable<HeroesPaginated> {
    const params = new HttpParams({
      fromObject: {
        name: names.map((name) => encodeURIComponent(name)).join(','),
      },
    })
      .set('page', Pagination.DEFAULT_PAGE.toString())
      .set('limit', Pagination.DEFAULT_LIMIT.toString());
    return this.http.get<HeroesPaginated>(`${this._heroesApi}/superheroes/by-names`, {
      params,
    });
  }

  getHeroById(id: string): Observable<Hero> {
    return this.http.get<Hero>(`${this._heroesApi}/superheroes/hero/${id}`);
  }

  getHeroByName(name: string): Observable<Hero> {
    const params = new HttpParams().set('name', encodeURIComponent(name));
    return this.http.get<Hero>(`${this._heroesApi}/superheroes/hero`, {
      params,
    });
  }

  // CRUD operations
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this._heroesApi}/superheroes/hero`, hero);
  }

  updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${this._heroesApi}/superheroes/hero/${hero.id}`, hero);
  }

  deleteHero(id: string): Observable<void> {
    return this.http.delete<void>(`${this._heroesApi}/superheroes/hero/${id}`);
  }

}
