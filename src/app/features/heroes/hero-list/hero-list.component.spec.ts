import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroListComponent } from './hero-list.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroService } from '../../../core/services/hero.service';
import { HeroesStore } from '../../../state/hero.store';
import { provideHttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarType } from '../../../core/enums/snack-bar.enum';
import { HEROES_MOCK } from '../../../core/constant/heroes.constant';
import { provideRouter } from '@angular/router';
import { DELETE_DIALOG_DATA } from '../../../core/constant/dialog.constant';
import { HeroDialog } from '../../../shared/dialog/dialog.component';
import { Pagination } from '../../../core/enums/pagination.enum';

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: HeroesStore,
          useValue: {
            getHeroes: () => HEROES_MOCK,
            deleteSelectedHero: (id: number) => HEROES_MOCK.filter(hero => hero.id !== id),
          }
        },
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
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should open a dialog when openDialog is called', () => {
    const hero = HEROES_MOCK[0];
    const dialog = TestBed.inject(MatDialog);
    spyOn(dialog, 'open').and.callThrough();

    component.openDialog(hero);

    expect(dialog.open).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalledWith(HeroDialog,{
      data: jasmine.objectContaining({
        ...DELETE_DIALOG_DATA,
        title: `Delete ${hero.name}`,
        hero: hero,
        actionType: 'delete',
      }),
    });
  });

  it('should delete a hero when deleteHero is called', () => {
    const hero = HEROES_MOCK[0];
    spyOn(component['store'], 'deleteSelectedHero').and.callThrough();

    component.deleteHero(hero);

    expect(component['store'].deleteSelectedHero).toHaveBeenCalledWith(hero.id);
  });

  it('should update pageSize and currentPage and call getHeroesPaginated on onPageChange', () => {
    component.pageSize.update(() => Pagination.DEFAULT_LIMIT);
    component.currentPage.update(() => Pagination.DEFAULT_PAGE);
    spyOn(component['store'], 'getHeroesPaginated').and.callThrough();

    const event = {
      pageIndex: Pagination.DEFAULT_LIMIT,
      pageSize: Pagination.DEFAULT_PAGE
    } as any;
    component.onPageChange(event);
    expect(component.pageSize()).toBe(event.pageSize);
    expect(component.currentPage()).toBe(event.pageIndex + 1);
    expect(component['store'].getHeroesPaginated).toHaveBeenCalledWith(event.pageIndex + 1, event.pageSize);
  });

  it('should call deleteHero and openNotification after dialog is closed in openDialog', () => {
    const hero = HEROES_MOCK[0];
    spyOn(component, 'deleteHero');
    spyOn(component, 'openNotification');
    component.openDialog(hero);
    expect(component.deleteHero).toHaveBeenCalledWith(hero);
    expect(component.openNotification).toHaveBeenCalledWith(`${hero.name} deleted successfully`, SnackBarType.SUCCESS);
  });

});
