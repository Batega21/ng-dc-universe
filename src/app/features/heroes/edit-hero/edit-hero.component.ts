import {
  Component,
  effect,
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
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { EDIT_DIALOG_DATA } from '../../../core/constant/dialog.constant';
import { Hero } from '../../../core/interfaces/hero';
import { ButtonBackComponent } from '../../../shared/button-back/button-back.component';
import { HeroDialog } from '../../../shared/dialog/dialog.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { HeroesStore } from '../../../state/hero.store';
import { HeroPowers } from '../../../core/enums/powers.enum';
import {
  SnackBarPosition,
  SnackBarType,
} from '../../../core/enums/snack-bar.enum';

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
  readonly store = inject(HeroesStore);
  private fb = inject(FormBuilder);
  private readonly router = inject(Router);
  public hero: WritableSignal<Hero> = signal({} as Hero);
  public error: string | null = null;
  readonly dialog = inject(MatDialog);
  public powers = Object.values(HeroPowers);
  public attemptedFetch = false;
  private _snackBar = inject(MatSnackBar);
  private horizontalPosition: MatSnackBarHorizontalPosition =
    SnackBarPosition.CENTER;
  private verticalPosition: MatSnackBarVerticalPosition = SnackBarPosition.TOP;
  @Input()
  set id(heroId: number) {
    this.store.getHeroById(heroId);
  }
  get id(): number {
    return this.hero().id;
  }

  public heroForm: FormGroup = this.fb.group({
    id: new FormControl(0, Validators.required),
    name: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z0-9\s-']+$/),
    ]),
    realName: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z0-9\s-']+$/),
    ]),
    alias: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9\s']+$/)]),
    alignment: new FormControl(''),
    powersGroup: this.fb.group(
      this.powers.reduce((acc, power) => {
        acc[power] = new FormControl(false);
        return acc;
      }, {} as { [key: string]: FormControl })
    ),
    team: new FormControl(''),
    origin: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9\s']+$/)]),
    firstAppearance: new FormControl('', [
      Validators.pattern(/^[a-zA-Z0-9\s#()/,]+$/),
    ]),
  });

  constructor() {
    effect(() => {
      const currentHero = this.store.selectedHero();
      this.hero.set(this.store.selectedHero());

      if (currentHero && (Object.keys(currentHero).length > 0 || currentHero.id)) {
        this.heroForm.patchValue({
          id: currentHero.id,
          name: currentHero.name,
          realName: currentHero.realName,
          alias: currentHero.alias,
          alignment: currentHero.alignment,
          team: currentHero.team,
          powersGroup: this.powers.reduce((acc, power) => {
            acc[power] = (currentHero.powers ?? []).includes(power);
            return acc;
          }, {} as { [key: string]: boolean }),
          origin: currentHero.origin,
          firstAppearance: currentHero.firstAppearance,
        });
      } else if (this.attemptedFetch) {
        this.error = 'Hero not found';
        this.router.navigate(['/hero']);
      }
    });
  }

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
    } as Hero;

    const dialogConfig = {
      data: {
        ...EDIT_DIALOG_DATA,
        title: `Update ${this.hero().name}`,
        message: `Updating ${
          this.hero().name
        } may result in creating another Multiverse... Are you sure you want to proceed?`,
        hero: heroFormData,
        actionType: 'edit',
        actionCallback: this.store.updateHero,
      },
    };

    const dialogRef = this.dialog.open(HeroDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.openNotification(
        `${heroFormData.name} updated successfully`,
        SnackBarType.SUCCESS
      );
    });
  }
}
