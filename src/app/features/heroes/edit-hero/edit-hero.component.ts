import {
  Component,
  inject,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';

import { EDIT_DIALOG_DATA } from '../../../core/constant/dialog.constant';
import { Hero } from '../../../core/interfaces/hero';
import { ButtonBackComponent } from '../../../shared/button-back/button-back.component';
import { HeroDialog } from '../../../shared/dialog/dialog.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { HeroesProvider } from '../../../state/hero.store';
import { HeroPowers } from '../../../core/constant/powers';

@Component({
  selector: 'app-edit-hero',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    LoaderComponent,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    CommonModule,
    ButtonBackComponent,
  ],
  templateUrl: './edit-hero.component.html',
  styleUrls: ['./edit-hero.component.scss'],
})
export class EditHeroComponent {
  readonly store = inject(HeroesProvider);
  private fb = inject(FormBuilder);
  private readonly route = inject(Router);
  public hero: WritableSignal<Hero> = signal({} as Hero);
  public error: string | null = null;
  readonly dialog = inject(MatDialog);
  public powers = Object.values(HeroPowers);
  @Input()
  set id(heroId: number) {
    this.fetchHeroDetails(heroId);
  }

  public heroForm: FormGroup;

  constructor() {
    const powerControls = this.powers.reduce((acc, power) => {
      acc[power] = new FormControl(false);
      return acc;
    }, {} as { [key: string]: FormControl });

    this.heroForm = this.fb.group({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),
      realName: new FormControl(''),
      alias: new FormControl(''),
      alignment: new FormControl(''),
      powersGroup: this.fb.group(powerControls),
      team: new FormControl(''),
      origin: new FormControl(''),
      firstAppearance: new FormControl(''),
      imageUrl: new FormControl(''),
    });
  }

  private fetchHeroDetails(id: number) {
    this.store.getHeroById(id);
    this.hero.update(() => this.store.selectedHero());
    if (!this.hero) {
      this.error = 'Hero not found';
      return;
    }
    this.heroForm.patchValue({
      id: this.hero().id,
      name: this.hero().name,
      realName: this.hero().realName,
      alias: this.hero().alias,
      alignment: this.hero().alignment,
      team: this.hero().team,
      powers: this.hero().powers,
      origin: this.hero().origin,
      firstAppearance: this.hero().firstAppearance,
      imageUrl: this.hero().imageUrl,
    });
  }

  get selectedPowers(): string[] {
    const powersGroup = this.heroForm.get('powersGroup') as FormGroup;
    return Object.entries(powersGroup.value)
      .filter(([_, selected]) => selected)
      .map(([power]) => power as string);
  }

  public openDialog(): void {
    const heroFormData: Hero = {
      ...this.hero(),
      name: this.heroForm.value.name || '',
      realName: this.heroForm.value.realName || '',
      alias: this.heroForm.value.alias || '',
      alignment: this.heroForm.value.alignment || '',
      team: this.heroForm.value.team || '',
      powers: this.selectedPowers || '',
      origin: this.heroForm.value.origin || '',
      firstAppearance: this.heroForm.value.firstAppearance || '',
      imageUrl: this.heroForm.value.imageUrl || '',
    } as Hero;

    const dialogConfig = {
      data: {
        ...EDIT_DIALOG_DATA,
        title: `Update ${this.hero().name}`,
        message: `Updating ${
          this.hero().name
        } may result in creating another Multiverse... Are you sure you want to proceed?`,
        hero: heroFormData || ({} as Hero),
        actionType: 'edit',
        actionCallback: this.store.updateHero,
      },
    };

    const dialogRef = this.dialog.open(HeroDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.route.navigate(['/']);
    });
  }
}
