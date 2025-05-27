import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHeroComponent } from './add-hero.component';
import { ActivatedRoute, provideRouter, Router, RouterLink } from '@angular/router';
import { HeroesProvider } from '../../../state/hero.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { SnackBarType } from '../../../core/enums/snack-bar.enum';

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
        HeroesProvider,
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

  it('should open dialog and navigate after closing', () => {
    const dialog = TestBed.inject(MatDialog);
    const router = TestBed.inject(Router);
    spyOn(dialog, 'open').and.callThrough();
    spyOn(router, 'navigate');
    spyOn(component, 'openNotification');

    component.heroForm.controls['name'].setValue('Superman');
    component.openDialog();

    expect(dialog.open).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(component.openNotification).toHaveBeenCalledWith('Superman added successfully', SnackBarType.SUCCESS);
  });
});
