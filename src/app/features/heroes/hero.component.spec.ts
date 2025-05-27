import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { HeroComponent } from './hero.component';
import { HeroesProvider } from '../../state/hero.store';
import { provideHttpClient } from '@angular/common/http';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroesProvider,
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
  
  it('should initialize the signal "title" with "Heroes"', () => {
    expect(component.title).toBeDefined();
    expect(component.title()).toBe('Heroes');
  });

  it('should have a store', () => {
    expect(component.store).toBeDefined();
  });

});
