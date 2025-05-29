import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { ADD_DIALOG_DATA } from '../../../core/constant/dialog.constant';
import { Hero } from '../../../core/interfaces/hero';
import { ButtonBackComponent } from '../../../shared/button-back/button-back.component';
import { HeroDialog } from '../../../shared/dialog/dialog.component';
import { HeroesStore } from '../../../state/hero.store';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackBarPosition, SnackBarType } from '../../../core/enums/snack-bar.enum';
import { HeroPowers } from '../../../core/enums/powers.enum';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-hero',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    CommonModule,
    ButtonBackComponent,
  ],
  templateUrl: './add-hero.component.html',
  styleUrls: ['./add-hero.component.scss'],
})
export class AddHeroComponent {
  readonly store = inject(HeroesStore);
  private fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  public hero: WritableSignal<Hero> = signal({} as Hero);
  public powers = Object.values(HeroPowers);
  public toggleUnit = signal(false);
  private _snackBar = inject(MatSnackBar);
  private horizontalPosition: MatSnackBarHorizontalPosition = SnackBarPosition.CENTER;
  private verticalPosition: MatSnackBarVerticalPosition = SnackBarPosition.TOP;

  public heroForm: FormGroup = this.fb.group({
    name: new FormControl('', Validators.required),
    realName: new FormControl('', Validators.required),
    alias: new FormControl(''),
    alignment: new FormControl('', Validators.required),
    powersGroup: this.fb.group(
      this.powers.reduce((acc, power) => {
        acc[power] = new FormControl(false);
        return acc;
      }, {} as { [key: string]: FormControl })),
    team: new FormControl(''),
    origin: new FormControl(''),
    firstAppearance: new FormControl(''),
  });

  openNotification(message: string, type: SnackBarType) {
    this._snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [`snackbar-${type}`],
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
      name: this.heroForm.value.name,
      realName: this.heroForm.value.realName,
      alias: this.heroForm.value.alias,
      alignment: this.heroForm.value.alignment,
      team: this.heroForm.value.team,
      powers: this.selectedPowers,
      origin: this.heroForm.value.origin,
      firstAppearance: this.heroForm.value.firstAppearance,
      imageUrl: '/img/hero-placeholder.png',
    } as Hero;

    const dialogConfig = {
      data: {
        ...ADD_DIALOG_DATA,
        actionCallback: this.store.addHero,
        hero: heroFormData,
        actionType: 'add',
      },
    };

    const dialogRef = this.dialog.open(HeroDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.openNotification(`${heroFormData.name} added successfully`, SnackBarType.SUCCESS);
    });
  }
}
