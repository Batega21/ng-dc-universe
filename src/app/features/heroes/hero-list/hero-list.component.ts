import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { DELETE_DIALOG_DATA } from '../../../core/constant/dialog.constant';
import { Hero } from '../../../core/interfaces/hero';
import { HeroDialog } from '../../../shared/dialog/dialog.component';
import { HeroesStore } from '../../../state/hero.store';
import { Pagination } from '../../../core/enums/pagination.enum';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackBarPosition, SnackBarType } from '../../../core/enums/snack-bar.enum';

@Component({
  selector: 'app-hero-list',
  imports: [
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss'],
  providers: [HeroesStore],
})
export class HeroListComponent {
  public readonly store = inject(HeroesStore);
  public readonly dialog = inject(MatDialog);
  public pageSize = signal(Pagination.DEFAULT_LIMIT);
  public currentPage = signal(Pagination.DEFAULT_PAGE);
  private _snackBar = inject(MatSnackBar);
  private horizontalPosition: MatSnackBarHorizontalPosition = SnackBarPosition.CENTER;
  private verticalPosition: MatSnackBarVerticalPosition = SnackBarPosition.TOP;

  constructor() {}

  openNotification(message: string, type: SnackBarType) {
    this._snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [`snackbar-${type}`],
    });
  }

  public onPageChange(event: PageEvent): void {
    this.pageSize.update(() => event.pageSize);
    this.currentPage.update(() => event.pageIndex + 1);

    this.store.getHeroesPaginated(this.currentPage(), this.pageSize());
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
      this.deleteHero(hero);
      this.openNotification(`${hero.name} deleted successfully`, SnackBarType.SUCCESS);
    });
  }

  public deleteHero(hero: Hero) {
    this.store.deleteHero(hero.id);
  }
}
