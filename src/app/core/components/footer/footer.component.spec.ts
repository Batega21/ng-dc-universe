import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { ActivatedRoute, provideRouter, RouterLink } from '@angular/router';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        RouterLink,
      ],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, 
          useValue: { 
            params: { subscribe: () => {} }, 
            snapshot: { paramMap: { get: () => null } } 
          }
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct copyright year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.copyrightYear).toBe(currentYear);
  });
});
