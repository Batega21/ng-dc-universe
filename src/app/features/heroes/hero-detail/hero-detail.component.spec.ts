import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroDetailComponent } from './hero-detail.component';
import { HeroesStore } from '../../../state/hero.store';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroService } from '../../../core/services/hero.service';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { HEROES_MOCK } from '../../../core/constant/heroes.constant';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarType } from '../../../core/enums/snack-bar.enum';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: HeroesStore,
          useClass: HeroesStore,
        },
        { provide: ActivatedRoute, 
          useValue: { 
            params: of({ id: HEROES_MOCK[0].id }), 
            snapshot: { paramMap: { get: () => HEROES_MOCK[0].id } }
          }
        },
        HeroService,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a store', () => {
    expect(component['store']).toBeDefined();
  });
  
  it('should fetch a hero details when input id is set', () => {
    const store = TestBed.inject(HeroesStore);
    spyOn(store, 'getHeroById');
    const heroId = HEROES_MOCK[0].id;

    component.id = heroId;

    expect(store.getHeroById).toHaveBeenCalledWith(heroId);
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
        horizontalPosition: component['horizontalPosition'],
        verticalPosition: component['verticalPosition'],
        panelClass: [`snackbar-${SnackBarType.SUCCESS}`],
      })
    );
  });

  it('should open dialog and delete after closing', () => {
    const store = TestBed.inject(HeroesStore);
    const dialog = TestBed.inject(MatDialog);
    const hero = HEROES_MOCK[0];

    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(true)
    } as any);
    spyOn(store, 'deleteSelectedHero');
    spyOn(component, 'openNotification');

    component.openDialog(hero);

    expect(dialog.open).toHaveBeenCalled();
    expect(store.deleteSelectedHero).toHaveBeenCalledWith(hero.id);
    expect(component.openNotification).toHaveBeenCalledWith(
      `${hero.name} deleted successfully`,
      SnackBarType.SUCCESS
    );
  });

});
