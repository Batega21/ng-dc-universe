import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroDialog } from './dialog.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroService } from '../../core/services/hero.service';
import { HeroesProvider } from '../../state/hero.store';
import { provideHttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideRouter, RouterLink } from '@angular/router';

describe('HeroDialog', () => {
  let component: HeroDialog;
  let fixture: ComponentFixture<HeroDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroDialog,
        RouterLink,
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroService,
        HeroesProvider,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
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

    fixture = TestBed.createComponent(HeroDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit false and close dialog on onNoClick', () => {
    const closeSpy = jasmine.createSpy('close');
    const emitSpy = spyOn(component.confirmed, 'emit');
    (component as any).dialogRef.close = closeSpy;

    component.onNoClick();

    expect(closeSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it('should emit true and close dialog on onConfirm', () => {
    const closeSpy = jasmine.createSpy('close');
    const emitSpy = spyOn(component.confirmed, 'emit');
    (component as any).dialogRef.close = closeSpy;
    (component as any).data.hero = { id: 1, name: 'Batman' };
    (component as any).data.actionType = 'edit';
    const updateHeroSpy = spyOn((component as any).store, 'updateHero');

    component.onConfirm();

    expect(updateHeroSpy).toHaveBeenCalledWith({ id: 1, name: 'Batman' });
    expect(emitSpy).toHaveBeenCalledWith(true);
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should call addHero if actionType is add on onConfirm', () => {
    const closeSpy = jasmine.createSpy('close');
    const emitSpy = spyOn(component.confirmed, 'emit');
    (component as any).dialogRef.close = closeSpy;
    (component as any).data.hero = { id: 2, name: 'Superman' };
    (component as any).data.actionType = 'add';
    const addHeroSpy = spyOn((component as any).store, 'addHero');

    component.onConfirm();

    expect(addHeroSpy).toHaveBeenCalledWith({ id: 2, name: 'Superman' });
    expect(emitSpy).toHaveBeenCalledWith(true);
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should only emit true and close dialog if no hero is provided on onConfirm', () => {
    const closeSpy = jasmine.createSpy('close');
    const emitSpy = spyOn(component.confirmed, 'emit');
    (component as any).dialogRef.close = closeSpy;
    (component as any).data.hero = undefined;
    (component as any).data.actionType = undefined;
    const updateHeroSpy = spyOn((component as any).store, 'updateHero');
    const addHeroSpy = spyOn((component as any).store, 'addHero');

    component.onConfirm();

    expect(updateHeroSpy).not.toHaveBeenCalled();
    expect(addHeroSpy).not.toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(true);
    expect(closeSpy).toHaveBeenCalled();
  });
});
