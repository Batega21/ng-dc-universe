import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DELETE_DIALOG_DATA } from '../../../core/constant/dialog.constant';
import { Hero } from '../../../core/interfaces/hero';
import { HeroDialog } from '../../../shared/dialog/dialog.component';
import { HeroesProvider } from '../../../state/hero.store';

@Component({
  selector: 'app-hero-list',
  imports: [
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss'],
  providers: [HeroesProvider],
})
export class HeroListComponent {
  readonly store = inject(HeroesProvider);
  readonly dialog = inject(MatDialog);

  constructor() {}

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
    });
  }

  public deleteHero(hero: Hero) {
    this.store.deleteSelectedHero(hero.id);
  }
}
