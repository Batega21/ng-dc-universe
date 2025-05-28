import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroDetailComponent } from './hero-detail.component';
import { HeroesStore } from '../../../state/hero.store';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroService } from '../../../core/services/hero.service';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { HEROES } from '../../../core/constant/heroes.constant';
import { of } from 'rxjs';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroesStore,
        HeroService,
        { provide: ActivatedRoute, 
          useValue: { 
            params: of({ id: HEROES[0].id }), 
            snapshot: { paramMap: { get: () => HEROES[0].id } }
          }
        },
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

  it('should get the id Input and set the heroId data', () => {
    const heroId = HEROES[0].id;

    component.hero.set({ id: heroId} as any)
    
    expect(component.id).toBeDefined();
    expect(component.id).toBe(heroId);
    expect(component.hero().id).toBe(heroId);
  });

  it('should fetch a hero by id', () => {
    const heroId = HEROES[0].id;
    spyOn(component['store'], 'getHeroById').and.callThrough();

    component.getHeroDetails(heroId);
    component.hero.update(() => HEROES[0]);

    expect(component['store'].getHeroById).toHaveBeenCalledWith(heroId);
    expect(component.hero().id).toBe(heroId);
  });

  it('should get a hero details on id change', () => {
    const heroId = HEROES[0].id;
    spyOn(component, 'getHeroDetails').and.callThrough();

    component.id = heroId;
    component.hero.update(() => HEROES[0]);

    expect(component.getHeroDetails).toHaveBeenCalledWith(heroId);
    expect(component.hero().id).toBe(heroId);
  });

});
