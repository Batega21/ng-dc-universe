import { Component, effect, inject, Input, Signal, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { HeroesProvider } from '../../../store/hero.store';
import { Hero } from '../../../interfaces/hero';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { HeroDialog } from '../../dialog/dialog.component';
import { ADD_DIALOG_DATA, EDIT_DIALOG_DATA } from '../../../constant/dialog.constant';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../services/logger.service';

@Component({
  selector: 'app-hero-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    LoaderComponent,
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss',
  standalone: true,
  providers: [
    HeroesProvider,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ],
})
export class HeroFormComponent {
  readonly store = inject(HeroesProvider);
  private readonly route = inject(ActivatedRoute);
  private readonly logger = inject(LoggerService);
  public hero: WritableSignal<Hero> = signal({} as Hero);
  public error: string | null = null;
  public isEditMode = signal(false);
  public actionButton = signal('');
  public actionButtonIcon = signal('');
  public isLoading = this.store.loading;
  readonly dialog = inject(MatDialog);
  @Input()
  set id(heroId: string) {
    this.fetchHeroDetails(heroId);
  }


  heroForm = new FormGroup({
    name: new FormControl(''),
    fullName: new FormControl(''),
    alterEgos: new FormControl(''),
    firstAppearance: new FormControl(''),
    placeOfBirth: new FormControl(''),
  });

  constructor() {
    effect(() => {
      const hero = this.store.selectedHero();
      console.log("🚀 Effect HERO:", hero)
      if (hero && hero.name) {
        this.hero.set(hero);
      }
    });
  }

  ngOnInit() {}

  private fetchHeroDetails(id: string) {
    this.store.getHeroById(id);
    this.isEditMode.set(!!this.id);
    console.log("🚀 ~ this.isEditMode:", this.isEditMode())
    this.actionButton.set(this.isEditMode() ? 'Update Hero' : 'Add Hero');
    this.actionButtonIcon.set(this.isEditMode() ? 'edit' : 'add');

    this.hero.update(() => this.store.selectedHero());
    if (!this.hero) {
      this.error = 'Hero not found';
      return;
    }
    this.heroForm.patchValue({
      name: this.store.selectedHero()?.name,
      fullName: this.store.selectedHero()?.biography['full-name'],
      alterEgos: this.store.selectedHero()?.biography['alter-egos'],
      firstAppearance: this.store.selectedHero()?.biography['first-appearance'],
      placeOfBirth: this.store.selectedHero()?.biography['place-of-birth'],
    });
  }

  public addHero() {
    const newHero: Hero = {
      ...this.hero(),
      name: this.heroForm.value.name || '',
      biography: {
        ...this.hero().biography,
        'full-name': this.heroForm.value.fullName || '',
        'alter-egos': this.heroForm.value.alterEgos || '',
        'first-appearance': this.heroForm.value.firstAppearance || '',
        'place-of-birth': this.heroForm.value.placeOfBirth || '',
      },
    } as Hero;

    this.store.addHero(newHero);
  }

  public openDialog(): void {
    console.log("🚀 ~ HeroFormComponent ~ openDialog ~ this.isEditMode:", this.isEditMode());
    const heroFormData: Hero = {
      ...this.hero(),
      name: this.heroForm.value.name || '',
      biography: {
        ...this.hero().biography,
        'full-name': this.heroForm.value.fullName || '',
        'alter-egos': this.heroForm.value.alterEgos || '',
        'first-appearance': this.heroForm.value.firstAppearance || '',
        'place-of-birth': this.heroForm.value.placeOfBirth || '',
      },
    } as Hero;

    const dialogConfig = this.isEditMode()
      ? {
          data: {
            ...EDIT_DIALOG_DATA,
            title: `Update ${this.hero().name}`,
            message: `Updating ${this.hero().name} may result in creating another Multiverse... Are you sure you want to proceed?`,
            hero: heroFormData || {} as Hero,
            actionType: 'edit',
            actionCallback: this.store.updateHero,
          },
        }
      : {
        data: {
          ...ADD_DIALOG_DATA,
          actionCallback: this.store.addHero,
          hero: this.hero() || {} as Hero,
          actionType: 'add',
        }
      };

    const dialogRef = this.dialog.open(HeroDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((isConfirmed) => {
      if (isConfirmed !== undefined) {
        this.isEditMode.set(isConfirmed);
      }
    });
  }
}
