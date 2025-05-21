import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';

import { LoaderComponent } from '../../../shared/loader/loader.component';
import { ADD_DIALOG_DATA } from '../../../core/constant/dialog.constant';
import { Hero } from '../../../core/interfaces/hero';
import { ButtonBackComponent } from '../../../shared/button-back/button-back.component';
import { HeroDialog } from '../../../shared/dialog/dialog.component';
import { HeroesProvider } from '../../../state/hero.store';

@Component({
  selector: 'app-add-hero',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    LoaderComponent,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    CommonModule,
    ButtonBackComponent,
  ],
  templateUrl: './add-hero.component.html',
  styleUrls: ['./add-hero.component.scss'],
})
export class AddHeroComponent {
  readonly store = inject(HeroesProvider);
  private readonly route = inject(Router);
  readonly dialog = inject(MatDialog);
  public hero: WritableSignal<Hero> = signal({} as Hero);
  public toggleUnit = signal(false);

  heroForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    realName: new FormControl(''),
    alias: new FormControl(''),
    alignment: new FormControl(''),
    team: new FormControl(''),
    powers: new FormControl(''),
    origin: new FormControl(''),
    firstAppearance: new FormControl(''),
  });

  public openDialog(): void {
    const heroFormData: Hero = {
      ...this.hero(),
      name: this.heroForm.value.name || '',
      realName: this.heroForm.value.realName || '',
      alias: this.heroForm.value.alias || '',
      alignment: this.heroForm.value.alignment || '',
      team: this.heroForm.value.team || '',
      powers: this.heroForm.value.powers || '',
      origin: this.heroForm.value.origin || '',
      firstAppearance: this.heroForm.value.firstAppearance || '',
      imageUrl: '/img/hero-placeholder.png',
      id: this.store.heroes().length + 1,
    } as Hero;

    const dialogConfig = {
      data: {
        ...ADD_DIALOG_DATA,
        actionCallback: this.store.addHero,
        hero: heroFormData || ({} as Hero),
        actionType: 'add',
      },
    };

    console.log(
      '🚀 ~ AddHeroComponent ~ openDialog ~ heroFormData:',
      heroFormData
    );

    const dialogRef = this.dialog.open(HeroDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((isConfirmed: boolean) => {
      if (isConfirmed !== undefined) {
        console.log(
          '🚀 ~ AddHeroComponent ~ openDialog ~ isConfirmed:',
          isConfirmed
        );
      }
      this.route.navigate(['/']);
    });
  }
}
