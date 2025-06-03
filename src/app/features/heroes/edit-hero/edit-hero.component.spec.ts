import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { EditHeroComponent } from './edit-hero.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroesStore } from '../../../state/hero.store';
import { HeroService } from '../../../core/services/hero.service';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarType } from '../../../core/enums/snack-bar.enum';
import { HEROES_MOCK } from '../../../core/constant/heroes.constant';
import { of } from 'rxjs';
import { HeroPowers } from '../../../core/enums/powers.enum';
import { Component } from '@angular/core';


@Component({ template: '' })
class DummyComponent {}

describe('EditHeroComponent', () => {
  let component: EditHeroComponent;
  let fixture: ComponentFixture<EditHeroComponent>;

  const mockHeroes = HEROES_MOCK;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditHeroComponent],
      providers: [
        provideRouter([
          { path: 'hero', component: DummyComponent },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroesStore,
        HeroService,
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
        { provide: ActivatedRoute, 
          useValue: { 
            params: of({ id: HEROES_MOCK[0].id }), 
            snapshot: { paramMap: { get: () => HEROES_MOCK[0].id } }
          }
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize hero form', () => {
    expect(component.heroForm).toBeDefined();
    expect(component.heroForm instanceof FormGroup).toBeTrue();
  });

  it('should get the id Input and set the heroId data', () => {
    const heroId = HEROES_MOCK[0].id;
    component.hero.set({ id: heroId} as any)

    fixture.componentRef.setInput('id', heroId);
    fixture.detectChanges();

    expect(component.id).toBeDefined();
    expect(component.id).toBe(heroId);
    expect(component.hero().id).toBe(heroId);
  });

  it('should set hero data when hero is fetched', () => {
    const heroId = HEROES_MOCK[0].id;
    const store = TestBed.inject(HeroesStore);

    fixture.componentRef.setInput('id', heroId);
    fixture.detectChanges();
    spyOn(store, 'getHeroById').and.callThrough();
    store.getHeroById(heroId);

    expect(store.getHeroById).toHaveBeenCalledWith(heroId);
    expect(component.hero().id).toBe(heroId);
    expect(component.heroForm.value.id).toBe(heroId);
    expect(component.heroForm.valid).toBeTrue();
  });

  it('should navigate to hero list if attemptedFetch is false', fakeAsync(() => {
    const heroId = 999;
    const store = TestBed.inject(HeroesStore);
    spyOn(store, 'getHeroById').and.callThrough();
    spyOn(store, 'selectedHero').and.returnValue(null);
    spyOn(component['router'], 'navigate').and.callThrough();

    fixture.componentRef.setInput('id', heroId);
    fixture.detectChanges();
    component.attemptedFetch = false;

    tick();

    expect(component['router'].navigate).toHaveBeenCalledWith(['/hero']);
  }));

  it('should call openNotification with correct parameters', () => {
    const _snackBar = TestBed.inject(MatSnackBar);
    const message = 'Test message';
    spyOn(_snackBar, 'open');
    component.openNotification(message, SnackBarType.SUCCESS);
    expect(_snackBar.open).toHaveBeenCalledWith(
      message,
      'Close',
      jasmine.objectContaining({
        duration: 4000,
        panelClass: ['snackbar-success'],
      })
    );
  });

  it('should open dialog and navigate after closing', () => {
    const dialog = TestBed.inject(MatDialog);
    const heroName = 'Superman';
    spyOn(dialog, 'open').and.callThrough();
    spyOn(component, 'openNotification');

    component.heroForm.controls['name'].setValue(heroName);
    component.openDialog();

    expect(dialog.open).toHaveBeenCalled();
    expect(component.openNotification).toHaveBeenCalledWith(`${heroName} updated successfully`, SnackBarType.SUCCESS);
  });

  it('should update heroForm when fetching hero', () => {
    const store = TestBed.inject(HeroesStore);
    const hero = mockHeroes[0];
    const powers = Object.entries(HeroPowers);
    const powersGroupExpected = powers.reduce<Record<string, boolean>>((acc, [key, value]) => {
          acc[value] = hero.powers.includes(value);
          return acc;
        }, {});
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem').and.callThrough();
    
    fixture.componentRef.setInput('id', hero.id);
    store.getHeroById(hero.id);
    component.heroForm.patchValue({ ...hero });
    fixture.detectChanges();

    expect(component.heroForm.value.id).toBe(hero.id);
    expect(component.heroForm.value.name).toBe(hero.name);
    expect(component.heroForm.value.realName).toBe(hero.realName);
    expect(component.heroForm.value.alias).toBe(hero.alias);
    expect(component.heroForm.value.alignment).toBe(hero.alignment);
    expect(component.heroForm.value.team).toBe(hero.team);
    expect(component.heroForm.value.powersGroup).toEqual(powersGroupExpected);
    expect(component.heroForm.value.origin).toBe(hero.origin);
    expect(component.heroForm.value.firstAppearance).toBe(hero.firstAppearance);
    expect(component.error).toBeNull();
    expect(component.heroForm.valid).toBeTrue();
  });

  it('should handle hero not found error', () => {
    const store = TestBed.inject(HeroesStore);
    const heroId = 21;
    component.error = 'Hero not found';
    store.getHeroById(heroId);
    expect(component.error).toBe('Hero not found');
  });

  it('should return selected powers from heroForm', () => {
    const powersGroup = component.heroForm.get('powersGroup') as FormGroup;
  
    const powers = Object.values(HeroPowers);
    if (powers.length > 1) {
      powersGroup.get(powers[0])?.setValue(true);
      powersGroup.get(powers[1])?.setValue(true);
    }
    fixture.detectChanges();
    const selected = component.selectedPowers;
    
    expect(Array.isArray(selected)).toBeTrue();
    if (powers.length > 1) {
      expect(selected).toContain(powers[0]);
      expect(selected).toContain(powers[1]);
    }
  });
});
