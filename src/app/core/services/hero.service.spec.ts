import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { HeroService } from './hero.service';
import { Pagination } from '../enums/pagination.enum';
import { provideHttpClient } from '@angular/common/http';
import { HEROES_MOCK } from '../constant/heroes.constant';

describe('HeroService', () => {
  let service: HeroService;
  let httpMock: HttpTestingController;
  
  const mockHeroes = HEROES_MOCK;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroService,
        {
          provide: '_heroesApi',
          useValue: 'http://localhost:3000',
        },
      ],
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

  it('should CREATE a hero with addHero method', () => {
    const newHero = HEROES_MOCK[0];
    service.addHero(newHero).subscribe((hero) => {
      expect(hero).toEqual(newHero);
    });

    const req = httpMock.expectOne(`${service['_heroesApi']}/superheroes`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newHero);
    req.flush(newHero);
  });
  it('should fail when CREATE a hero', () => {
    const newHero = HEROES_MOCK[0];
    service.addHero(newHero).subscribe({
      next: () => {
        fail('Expected an error, but got a hero instead');
      },
      error: (error) => {
        expect(error.statusText).toBe('Bad Request');
        expect(error.status).toBe(400);
        expect(error.error).toBe('Error adding hero');
      }
    });

    const req = httpMock.expectOne(`${service['_heroesApi']}/superheroes`);
    req.flush('Error adding hero', { status: 400, statusText: 'Bad Request' });
  });

  it('should GET a hero with getHeroById() method', () => {
    const heroId = 1;
    const url = `${service['_heroesApi']}/superheroes/${heroId}`;
    service.getHeroById(heroId).subscribe((hero) => {
      expect(hero).toEqual(mockHeroes[0]);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes[0]);
  });

  it('should fail when hero by ID is not found', () => {
    const heroId = 7;
    const url = `${service['_heroesApi']}/superheroes/${heroId}`;

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

  it('should GET heroes with getHeroes() method', () => {
    service.getHeroes().subscribe((heroes) => {
      expect(heroes.length).toBe(8);
      expect(heroes).toEqual(mockHeroes);
    });

    const req = httpMock.expectOne(`${service['_heroesApi']}/superheroes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);  
  });

  it('should fail when Heroes are not found', () => {
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

  it('should GET heroes with getHeroesPaginated() method', () => {
    const page = Pagination.DEFAULT_PAGE;
    const limit = Pagination.DEFAULT_LIMIT;
    const responseData = {
      heroes: mockHeroes,
      heroesCount: 2,
    };
    service.getHeroesPaginated(page, limit).subscribe((response) => {
      expect(response).toEqual(responseData);
    });

    const req = httpMock.expectOne(`${service['_heroesApi']}/superheroes/pagination?page=${page}&limit=${limit}`);
    expect(req.request.method).toBe('GET');
    req.flush(responseData);
  });

  it('should fail when heroes paginated are not found', () => {
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

  it('should GET heroes with getHeroesByQueryParams() method', () => {
    const queryName = 'Superman';
    service.getHeroesByQueryParams(queryName).subscribe((heroes) => {
      expect(heroes.length).toBe(1);
      expect(heroes[0]).toEqual(mockHeroes[0]);
    });
    
    const req = httpMock.expectOne(`${service['_heroesApi']}/superheroes/search?name=${queryName}`);
    expect(req.request.method).toBe('GET');
    req.flush([mockHeroes[0]]);
  });

  it('should fail when heroes by query are not found', () => {
    const queryName = mockHeroes[0].name;
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

  it('should GET a hero by name with getHeroByName() method', () => {
    const heroName = 'Superman';
    service.getHeroByName(heroName).subscribe((hero) => {
      expect(hero).toEqual(mockHeroes[0]);
    });

    const req = httpMock.expectOne(`${service['_heroesApi']}/superheroes/hero?name=${encodeURIComponent(heroName)}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes[0]);
  });

  it('should fail when hero by name is not found', () => {
    const heroName = mockHeroes[0].name;
    const url = `${service['_heroesApi']}/superheroes/hero?name=${encodeURIComponent(heroName)}`;
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

  it('should GET heroes by names with the getHeroesByNames() method', () => {
    const names = ['Superman', 'Batman'];
    const encodedNames = names.map(name => encodeURIComponent(name)).join(',');
    const page = Pagination.DEFAULT_PAGE;
    const limit = Pagination.DEFAULT_LIMIT;
    const url = `${service['_heroesApi']}/superheroes/by-names?name=${encodedNames}&page=${page}&limit=${limit}`;

    const responseData = {
      heroes: mockHeroes,
      heroesCount: 2,
    };
    service.getHeroesByNames(names).subscribe((response) => {
      expect(response).toEqual(responseData);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(responseData);
  });

  it('should fail when heroes by names are not found', () => {
    const names = [mockHeroes[0].name, mockHeroes[1].name];
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

  it('should UPDATE a hero by id with updateHero() method', () => {
    const updatedHero = { ...mockHeroes[0], name: 'Updated Superman' };
    service.updateHero(updatedHero).subscribe((hero) => {
      expect(hero).toEqual(updatedHero);
    });

    const req = httpMock.expectOne(`${service['_heroesApi']}/superheroes/${updatedHero.id}`);

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedHero);
    req.flush(updatedHero);
  });

  it('should fail when updating a hero', () => {
    const updatedHero = { ...mockHeroes[0], name: 'Updated Superman' };
    const message = 'Error updating hero';
    const url = `${service['_heroesApi']}/superheroes/${updatedHero.id}`;
    service.updateHero(updatedHero).subscribe({
      next: () => {
        fail('Expected an error, but got an updated hero');
      },
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
        expect(error.error).toBe(message);
      }
    });

    const req = httpMock.expectOne(url);
    req.flush(message, { status: 400, statusText: 'Bad Request' });
  });

  it('should DELETE a hero with deleteHero() method', () => {
    const heroId = HEROES_MOCK[0].id;
    const url = `${service['_heroesApi']}/superheroes/${heroId}`;
    service.deleteHero(heroId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

});
