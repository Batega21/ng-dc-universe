import {
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { HeroService } from '../../core/services/hero.service';
import { HeroesStore } from '../../state/hero.store';
import { SnackBarPosition, SnackBarType } from '../../core/enums/snack-bar.enum';

@Component({
  selector: 'app-search-box',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, ReactiveFormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
})
export class SearchBoxComponent {
  public readonly store = inject(HeroesStore);
  private readonly _heroesService = inject(HeroService);
  private readonly route = inject(Router);
  public heroesQuery = signal<string[]>([]);
  public searchValue = signal('');
  public searchBoxForm = new FormGroup({
    searchBox: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z0-9\s]+$/),
    ]),
  });
  private _snackBar = inject(MatSnackBar);
  private horizontalPosition: MatSnackBarHorizontalPosition = SnackBarPosition.CENTER;
  private verticalPosition: MatSnackBarVerticalPosition = SnackBarPosition.TOP;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.heroesQuery.update(() => []);
    }
  }

  openNotification(message: string, type: SnackBarType) {
    this._snackBar.open(message, 'Close', {
      duration: 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [`snackbar-${type}`],
    });
  }

  onClearFilter() {
    this.searchValue.update(() => '');
    this.heroesQuery.update(() => []);
    this.searchBoxForm.get('searchBox')?.setValue('');
  }

  onFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchValue.update(() => input.value);

    if (input.value.length >= 3) {
      this._heroesService.getHeroesByQueryParams(input.value)
        .subscribe({
          next: (response) => {
            this.heroesQuery.update((heroes) => {
              const existingHeroes = heroes.filter((hero) =>
                response.map((h) => h.name).includes(hero)
              );
              if (existingHeroes.length > 0) return heroes;

              const newHeroes = response.map((hero) => hero.name);
              return [...heroes, ...newHeroes];
            });
          },
          error: (error) => {
            this.openNotification('Hero with these parameters not found', SnackBarType.ERROR);
          },
        })
    }
  }

  onSelectedHero(heroName: string) {
    this._heroesService.getHeroByName(heroName).subscribe({
      next: (response) => {
        this.onClearFilter();
        this.route.navigate(['hero', response.id]);
      },
      error: (error) => {
        this.openNotification('Error fetching hero by name', SnackBarType.ERROR);
        this.onClearFilter();
      },
    });
  }

  onGetAllHeroesListed(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.heroesQuery().length === 0 || this.heroesQuery().length === 1 && this.heroesQuery()[0] === '') {
      this.openNotification('No heroes selected', SnackBarType.ERROR);
      this.onClearFilter();
      return;
    }

    this.store.getHeroesByNames(this.heroesQuery());
    this.onClearFilter();
  }
}
