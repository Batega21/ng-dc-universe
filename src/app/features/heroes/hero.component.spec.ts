import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { HeroComponent } from './hero.component';
import { HeroesStore } from '../../state/hero.store';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroesStore,
      ],
    })

    .compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should initialize the signal "title" with "DC Heroes"', () => {
    expect(component.title).toBeDefined();
    expect(component.title()).toBe('DC Heroes');
  });

  it('should have a store', () => {
    expect(component.store).toBeDefined();
  });

});
