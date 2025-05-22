import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroDialog } from './dialog.component';

describe('HeroDialog', () => {
  let component: HeroDialog;
  let fixture: ComponentFixture<HeroDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
