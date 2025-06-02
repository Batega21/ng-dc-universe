import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHeroComponent } from './add-hero.component';
import { ActivatedRoute, provideRouter, Router, RouterLink } from '@angular/router';
import { HeroesStore } from '../../../state/hero.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { SnackBarType } from '../../../core/enums/snack-bar.enum';
import { FormGroup } from '@angular/forms';
import { HEROES_MOCK } from '../../../core/constant/heroes.constant';
import { Hero } from '../../../core/interfaces/hero';

describe('AddHeroComponent', () => {
  let component: AddHeroComponent;
  let fixture: ComponentFixture<AddHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddHeroComponent,
        RouterLink,
      ],
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

    fixture = TestBed.createComponent(AddHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when required fields are empty', () => {
    component.heroForm.controls['name'].setValue('');
    expect(component.heroForm.invalid).toBeTrue();
  });

  it('should have a valid form when required fields are filled', () => {
    component.heroForm.controls['name'].setValue('Batman');
    component.heroForm.controls['realName'].setValue('Batman');
    component.heroForm.controls['alignment'].setValue('Batman');
    expect(component.heroForm.valid).toBeTrue();
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

  it('should openDialog() and create a hero then closing', () => {
    const dialog = TestBed.inject(MatDialog);
    const heroFormData = HEROES_MOCK[0] || {} as Hero;
    spyOn(dialog, 'open').and.callThrough();
    spyOn(component, 'openNotification');

    component.heroForm.controls['name'].setValue('Superman');
    component.openDialog();

    expect(dialog.open).toHaveBeenCalled();
    expect(component.heroForm.value.name).toBe('Superman');
    expect(component.openNotification).toHaveBeenCalledWith('Superman added successfully', SnackBarType.SUCCESS);
  });

  it('should return an Array of selected powers', () => {
    const powersGroup = component.heroForm.get('powersGroup') as FormGroup;
    powersGroup.patchValue({
      'Flight': true,
      'Super Strength': false,
      'Invisibility': true,
      'Telepathy': false,
    });

    const selected = component.selectedPowers;

    expect(selected).toContain('Flight');
    expect(selected).toContain('Invisibility');
    expect(selected).not.toContain('Martial Arts');
  });
});
