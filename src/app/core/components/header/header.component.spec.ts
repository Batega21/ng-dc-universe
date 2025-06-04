import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroesStore } from '../../../state/hero.store';
import { ActivatedRoute, provideRouter, RouterLink } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let linkDes: DebugElement[];
  let routerLinks: RouterLink[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterLink,
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroesStore,
        { provide: ActivatedRoute, 
          useValue: { 
            params: { subscribe: () => {} }, 
            snapshot: { paramMap: { get: () => null } } 
          }
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));
    routerLinks = linkDes.map((de) => de.injector.get(RouterLink));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title', () => {
    expect(component.title()).toBe('Heroes');
  });
});
