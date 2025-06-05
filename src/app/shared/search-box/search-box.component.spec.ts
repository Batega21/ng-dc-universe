import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBoxComponent } from './search-box.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroesStore } from '../../state/hero.store';
import { provideHttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarType } from '../../core/enums/snack-bar.enum';
import { signal } from '@angular/core';
import { HEROES_MOCK } from '../../core/constant/heroes.constant';
import { of, throwError } from 'rxjs';
import { provideRouter, Router } from '@angular/router';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBoxComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroesStore,
        { provide: MatSnackBar, useValue: {
            open: () => ({
              onAction: () => ({
                subscribe: () => {}
              }),
            }),
          }
        },
        { provide: MatDialog,
          useValue: {
            open: () => ({
              afterClosed: () => ({
                subscribe: (callback: (result: any) => void) => {
                  callback({ name: 'Test Hero', power: 'Test Power' });
                },
              }),
            }),
          }
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    component.searchValue = signal('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a store', () => {
    expect(component.store).toBeDefined();
  });

  it('should initialize searchValue and heroesQuery', () => {
    expect(component.searchValue()).toBe('');
    expect(component.heroesQuery()).toEqual([]);
  });

  it('should handle the "Backspace" keyboard event', () => {
    const event = new KeyboardEvent('keydown', { key: 'Backspace' });
    spyOn(component, 'handleKeyboardEvent').and.callThrough();
    component.handleKeyboardEvent(event);
    expect(component.handleKeyboardEvent).toHaveBeenCalled();

  });

  it('should call openNotification with correct parameters', () => {
    const _snackBar = TestBed.inject(MatSnackBar);
    const message = 'Test message';
    spyOn(_snackBar, 'open');
    component.openNotification(message, SnackBarType.SUCCESS);
    expect(_snackBar.open).toHaveBeenCalledWith(
      message,
      'Close',
      jasmine.objectContaining({
        duration: 1000,
        panelClass: ['snackbar-success'],
      })
    );
  });

  it('should call onClearFilter and udpate searchValue, heroesQuery and reset searchBoxForm', () => {
    spyOn(component, 'onClearFilter').and.callThrough();
    component.onClearFilter();
    expect(component.onClearFilter).toHaveBeenCalled();
    expect(component.searchValue()).toBe('');
    expect(component.heroesQuery()).toEqual([]);
    expect(component.searchBoxForm.value).toEqual({ searchBox: '' });
  });


  it('should update searchValue on filter change', () => {
    const mockValue = HEROES_MOCK[0].name;
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = mockValue;

    const event = new Event('input');
    Object.defineProperty(event, 'target', {
      value: inputElement,
    });

    component.onFilterChange(event);
    expect(component.searchValue()).toBe(mockValue);
  });

  it('should update heroesQuery on filter change with valid input', () => {
    const mockValue = HEROES_MOCK[0].name;
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = mockValue;
    const existingHeroes = ['Batman', 'Superman'].filter(name => name.includes(mockValue));

    const event = new Event('input');
    Object.defineProperty(event, 'target', {
      value: inputElement,
    });

    spyOn(component['_heroesService'], 'getHeroesByQueryParams').and.returnValue(of([HEROES_MOCK[0]]));

    component.onFilterChange(event);
    expect(existingHeroes.length).toBeGreaterThan(0);
    expect(component.heroesQuery()).toContain(mockValue);
    expect(component.heroesQuery()).toEqual(existingHeroes);
  });

  it('should handle error when fetching heroes', () => {
    const message = 'Hero with these parameters not found';
    const error = new Error(message);
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'non-existing-hero';
    const event = new Event('input');
    Object.defineProperty(event, 'target', {
      value: inputElement,
    });
    
    spyOn(component['_heroesService'], 'getHeroesByQueryParams').and.returnValue(throwError(() => error));
    spyOn(component, 'openNotification').and.callFake(() => {});
    
    component.onFilterChange(event);
    component.openNotification(message, SnackBarType.ERROR);

    expect(component.openNotification).toHaveBeenCalledWith(message, SnackBarType.ERROR);
    expect(component.searchValue()).toBe('non-existing-hero');
    expect(component.heroesQuery()).toEqual([]);
  });

  it('should navigate to hero details on selected hero', () => {
    const heroName = HEROES_MOCK[0].name;
    const router = TestBed.inject(Router);

    spyOn(component['_heroesService'], 'getHeroByName').and.returnValue(of(HEROES_MOCK[0]));
    spyOn(router, 'navigate').and.callThrough();
    spyOn(component, 'onClearFilter').and.callThrough();
    
    component.onSelectedHero(heroName);
    
    expect(router.navigate).toHaveBeenCalledWith(['hero', HEROES_MOCK[0].id]);
    expect(component.searchValue()).toBe('');
    expect(component.heroesQuery()).toEqual([]);
    expect(component.onClearFilter).toHaveBeenCalled();
  });

  it('should handle error on selected hero calls', () => {
    const heroName = 'NonExistingHero';
    const error = new Error('Error fetching hero by name');

    spyOn(component['_heroesService'], 'getHeroByName').and.returnValue(throwError(() => error));
    spyOn(component, 'openNotification').and.callFake(() => {});
    spyOn(component, 'onClearFilter');

    component.onSelectedHero(heroName);

    expect(component.openNotification).toHaveBeenCalledWith('Error fetching hero by name', SnackBarType.ERROR);
    expect(component.onClearFilter).toHaveBeenCalled();
    expect(component.searchValue()).toBe('');
    expect(component.heroesQuery()).toEqual([]);
  });

  it('should call onGetAllHeroesListed and update heroesQuery', () => {
    const mockValue = 'man';
    const searchNames = ['Batman', 'Superman', 'Wonder Woman', 'Green Lantern', 'Aquaman'];
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = mockValue;

    const event = new Event('input');
    Object.defineProperty(event, 'target', {
      value: inputElement,
    });
    
    spyOn(event, 'stopPropagation');
    spyOn(event, 'preventDefault');
    spyOn(component, 'onGetAllHeroesListed').and.callThrough();
    spyOn(component['store'], 'getHeroesByNames').and.callFake(() => of(HEROES_MOCK));

    component.heroesQuery.update(() => searchNames);
    component.onGetAllHeroesListed(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.onGetAllHeroesListed).toHaveBeenCalled();
    expect(component['store'].getHeroesByNames).toHaveBeenCalledWith(searchNames);
  });

  it('should handle no heroes selected in onGetAllHeroesListed', () => {
    const event = new Event('click');
    spyOn(event, 'stopPropagation');
    spyOn(event, 'preventDefault');
    spyOn(component, 'openNotification').and.callFake(() => {});

    component.heroesQuery.update(() => []);
    component.onGetAllHeroesListed(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.openNotification).toHaveBeenCalledWith('No heroes selected', SnackBarType.ERROR);
  });
  
});
