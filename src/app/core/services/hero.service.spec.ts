import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { HeroService } from './hero.service';
import { Pagination } from '../enums/pagination.enum';
import { HttpClient } from '@angular/common/http';

describe('HeroService', () => {
  let service: HeroService;
  let httpMock: HttpTestingController;
  
  const mockHeroes = [
    {
      id: 1,
      name: 'Superman',
      alias: 'Man of steel',
      powers: ['Flight'],
      firstAppearance: '1938',
      alignment: 'Good',
      team: 'Justice League',
      realName: 'Clark Kent',
      origin: 'Krypton',
      imageUrl: 'https://example.com/superman.jpg',
    },
    {
      id: 2,
      name: 'Batman',
      alias: 'The Dark Night',
      powers: ['Intelligence'],
      firstAppearance: '1939',
      alignment: 'Good',
      team: 'Justice League',
      realName: 'Bruce Wayne',
      origin: 'Gotham City',
      imageUrl: 'https://example.com/batman.jpg',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeroService, HttpClient],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(HeroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a heroesApi property', () => {
    expect(service['_heroesApi']).toBe('http://localhost:3000');
  });

  it('should be null when heroesApi is not set', () => {
    const serviceWithoutApi = new HeroService();
    expect(serviceWithoutApi['_heroesApi']).toBeUndefined();
  });

  it('should have a getHeroById method', () => {
    expect(service.getHeroById).toBeDefined();
  });

  it('should fetch a hero with getHeroById method', () => {
    const heroId = '1';
    const url = `${service['_heroesApi']}/superheroes/hero/${heroId}`;
    service.getHeroById(heroId).subscribe((hero) => {
      expect(hero).toEqual(mockHeroes[0]);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes[0]);
  });

  it('should fail when hero is not found', () => {
    const heroId = '7';
    const url = `${service['_heroesApi']}/superheroes/hero/${heroId}`;

    service.getHeroById(heroId).subscribe({
      next: () => {
          fail('Expected an error, but got a hero');
        },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.error).toBe('Hero not found');
        }
      }
    );

    const req = httpMock.expectOne(url);
    req.flush('Hero not found', { status: 404, statusText: 'Not Found' });
  });

  it('should have a getHeroes method', () => {
    expect(service.getHeroes).toBeDefined();
  });

  it('should fetch heroes with getHeroes method', () => {
    service.getHeroes().subscribe((heroes) => {
      expect(heroes.length).toBe(2);
      expect(heroes).toEqual(mockHeroes);
    });

    const req = httpMock.expectOne(`${service['_heroesApi']}/superheroes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);  
  });

  it('should fail when heroes are not found', () => {
    service.getHeroes().subscribe({
      next: () => {
        fail('Expected an error, but got heroes');
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.error).toBe('Heroes not found');
      }
    });

    const req = httpMock.expectOne(`${service['_heroesApi']}/superheroes`);
    req.flush('Heroes not found', { status: 404, statusText: 'Not Found' });
  });

  it('should have a getHeroesPaginated method', () => {
    expect(service.getHeroesPaginated).toBeDefined();
  });

  it('should fetch paginated heroes with getHeroesPaginated method', () => {
    const page = Pagination.DEFAULT_PAGE;
    const limit = Pagination.DEFAULT_LIMIT;
    const responseData = {
      data: mockHeroes,
      totalHeroes: 2,
    };
    service.getHeroesPaginated(page, limit).subscribe((response) => {
      expect(response).toEqual(responseData);
    });

    const req = httpMock.expectOne(`${service['_heroesApi']}/superheroes/pagination?page=${page}&limit=${limit}`);
    expect(req.request.method).toBe('GET');
    req.flush(responseData);
  });

  it('should fail when paginated heroes are not found', () => {
    const page = Pagination.DEFAULT_PAGE;
    const limit = Pagination.DEFAULT_LIMIT;
    const url = `${service['_heroesApi']}/superheroes/pagination?page=${page}&limit=${limit}`;
    service.getHeroesPaginated(page, limit).subscribe({
      next: () => {
        fail('Expected an error, but got paginated heroes');
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.error).toBe('Paginated heroes not found');
      }
    });

    const req = httpMock.expectOne(url);
    req.flush('Paginated heroes not found', { status: 404, statusText: 'Not Found' });
  });

  it('should have a getHeroesByQueryParams method', () => {
    expect(service.getHeroesByQueryParams).toBeDefined();
  });

  it('should fetch heroes by query params with getHeroesByQueryParams method', () => {
    const queryName = 'Superman';
    service.getHeroesByQueryParams(queryName).subscribe((heroes) => {
      expect(heroes.length).toBe(1);
      expect(heroes[0]).toEqual(mockHeroes[0]);
    });
    
    const req = httpMock.expectOne(`${service['_heroesApi']}/superheroes/search?name=${queryName}`);
    expect(req.request.method).toBe('GET');
    req.flush([mockHeroes[0]]);
  });

  it('should fail when heroes by query params are not found', () => {
    const queryName = 'Unknown Soldier';
    service.getHeroesByQueryParams(queryName).subscribe({
      next: () => {
        fail('Expected an error, but got heroes by query params');
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.error).toBe('Heroes by query params not found');
      }
    });

    const req = httpMock.expectOne(`${service['_heroesApi']}/superheroes/search?name=${queryName}`);
    req.flush('Heroes by query params not found', { status: 404, statusText: 'Not Found' });
  });  

  it('should have a getHeroByName method', () => {
    expect(service.getHeroByName).toBeDefined();
  });

  it('should fetch a hero by name with getHeroByName method', () => {
    const heroName = 'Superman';
    service.getHeroByName(heroName).subscribe((hero) => {
      expect(hero).toEqual(mockHeroes[0]);
    });

    const req = httpMock.expectOne(`${service['_heroesApi']}/superheroes/hero?name=${encodeURIComponent(heroName)}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes[0]);
  });

  it('should have a getHeroesByNames method', () => {
    expect(service.getHeroesByNames).toBeDefined();
  });

  it('should fail when hero by name is not found', () => {
    const heroName = encodeURIComponent('Manolito el Fuerte');
    const url = `${service['_heroesApi']}/superheroes/hero?name=${heroName}`;
    service.getHeroByName(heroName).subscribe({
      next: () => {
        fail('Expected an error, but got a hero by name');
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.error).toBe('Hero by name not found');
      }
    });
    
    const req = httpMock.expectOne(url);
    req.flush('Hero by name not found', { status: 404, statusText: 'Not Found' });
  });

  it('should fetch heroes by names with the getHerosByNames method', () => {
    const names = ['Superman', 'Batman'];
    const encodedNames = names.map(name => encodeURIComponent(name)).join(',');
    const page = Pagination.DEFAULT_PAGE;
    const limit = Pagination.DEFAULT_LIMIT;
    const url = `${service['_heroesApi']}/superheroes/by-names?name=${encodedNames}&page=${page}&limit=${limit}`;

    const responseData = {
      data: mockHeroes,
      totalHeroes: 2,
    };
    service.getHeroesByNames(names).subscribe((response) => {
      expect(response).toEqual(responseData);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(responseData);
  });

  it('should fail when heroes by names are not found', () => {
    const names = ['Unknown Soldier', 'Manolito el Fuerte'];
    const encodedNames = names.map(name => encodeURIComponent(name)).join(',');
    const page = Pagination.DEFAULT_PAGE;
    const limit = Pagination.DEFAULT_LIMIT;
    const url = `${service['_heroesApi']}/superheroes/by-names?name=${encodedNames}&page=${page}&limit=${limit}`;

    service.getHeroesByNames(names).subscribe({
      next: () => {
        fail('Expected an error, but got heroes by names');
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.error).toBe('Heroes by names not found');
      }
    });

    const req = httpMock.expectOne(url);
    req.flush('Heroes by names not found', { status: 404, statusText: 'Not Found' });
  });
});
