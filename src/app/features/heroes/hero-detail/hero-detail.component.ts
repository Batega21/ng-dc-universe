import { Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { TitleCasePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';

import { Hero } from '../../../core/interfaces/hero';
import { ButtonBackComponent } from '../../../shared/button-back/button-back.component';
import { HeroesStore } from '../../../state/hero.store';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DELETE_DIALOG_DATA } from '../../../core/constant/dialog.constant';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackBarPosition, SnackBarType } from '../../../core/enums/snack-bar.enum';
import { HeroDialog } from '../../../shared/dialog/dialog.component';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatGridListModule,
    MatListModule,
    RouterLink,
    TitleCasePipe,
    ButtonBackComponent,
    MatTooltipModule,
    LoaderComponent,
  ],
  providers: [],
})
export class HeroDetailComponent {
  public readonly store = inject(HeroesStore);
  readonly dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private horizontalPosition: MatSnackBarHorizontalPosition = SnackBarPosition.CENTER;
  private verticalPosition: MatSnackBarVerticalPosition = SnackBarPosition.TOP;
  @Input()
  set id(heroId: number) {
    this.store.getHeroById(heroId);
  }
  
  openNotification(message: string, type: SnackBarType) {
    this._snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [`snackbar-${type}`],
    });
  }
  
  public openDialog(hero: Hero) {
    const dialogConfig = {
      data: {
        ...DELETE_DIALOG_DATA,
        title: `Delete ${hero.name}`,
        hero: hero,
        actionType: 'delete',
      }
    }

    const dialogRef = this.dialog.open(HeroDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.store.deleteSelectedHero(hero.id);
      this.openNotification(`${hero.name} deleted successfully`, SnackBarType.SUCCESS);
    });
  }
}
