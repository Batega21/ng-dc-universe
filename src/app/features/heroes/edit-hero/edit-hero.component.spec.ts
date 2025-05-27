import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHeroComponent } from './edit-hero.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroesProvider } from '../../../state/hero.store';
import { HeroService } from '../../../core/services/hero.service';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarType } from '../../../core/enums/snack-bar.enum';
import { HEROES } from '../../../core/constant/heroes.constant';
import { of } from 'rxjs';

describe('EditHeroComponent', () => {
  let component: EditHeroComponent;
  let fixture: ComponentFixture<EditHeroComponent>;

  const mockHeroes = HEROES;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditHeroComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroesProvider,
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
            params: of({ id: HEROES[0].id }), 
            snapshot: { paramMap: { get: () => HEROES[0].id } }
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
    const heroId = HEROES[0].id;
    component.hero.set({ id: heroId} as any)
    expect(component.id).toBeDefined();
    expect(component.id).toBe(heroId);
    expect(component.hero().id).toBe(heroId);
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
        duration: 4000,
        panelClass: ['snackbar-success'],
      })
    );
  });

  it('should open dialog and navigate after closing', () => {
    const dialog = TestBed.inject(MatDialog);
    const router = TestBed.inject(Router);
    const heroName = 'Superman';
    spyOn(dialog, 'open').and.callThrough();
    spyOn(router, 'navigate');
    spyOn(component, 'openNotification');

    component.heroForm.controls['name'].setValue(heroName);
    component.openDialog();

    expect(dialog.open).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(component.openNotification).toHaveBeenCalledWith(`${heroName} updated successfully`, SnackBarType.SUCCESS);
  });

  it('should fetch hero details', () => {
    const heroId = HEROES[0].id;
    const hero = mockHeroes.find(hero => hero.id === heroId) || {} as any;
    
    spyOn(component, 'fetchHeroDetails').and.callFake((id: number) => {
      component.hero.set(mockHeroes.find(hero => hero.id === id) || {} as any);
    });
    fixture.componentRef.setInput('id', heroId);
    
    expect(component.hero()).toBeDefined();
    expect(component.hero().name).toBe(hero.name);
    expect(component.hero().origin).toBe(hero.origin);
  });

  it('should update heroForm when fetching hero', () => {
    const heroId = HEROES[0].id;
    
    component.fetchHeroDetails = jasmine.createSpy().and.callFake((id: number) => {
      const hero = mockHeroes.find(hero => hero.id === id) || {} as any;
      component.hero.set(hero);
      component.heroForm.patchValue({
        id: hero.id,
        name: hero.name,
        realName: hero.realName,
        alias: hero.alias,
        alignment: hero.alignment,
        team: hero.team,
        powers: hero.powers,
        origin: hero.origin,
        firstAppearance: hero.firstAppearance,
        imageUrl: hero.imageUrl,
      });
    });

    component.fetchHeroDetails(heroId);

    expect(component.id).toBe(heroId);
    expect(component.hero()).toBeDefined();
  });

  it('should handle hero not found error', () => {
    const heroId = 21;
    component.error = 'Hero not found';
    component.fetchHeroDetails(heroId);
    expect(component.error).toBe('Hero not found');
  });
});
