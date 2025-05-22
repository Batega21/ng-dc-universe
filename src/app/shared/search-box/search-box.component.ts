import {
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  filter,
  distinctUntilChanged,
  tap,
  switchMap,
} from 'rxjs';
import { HeroService } from '../../core/services/hero.service';
import { LoggerService } from '../../core/services/logger.service';
import { HeroesProvider } from '../../state/hero.store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-box',
  imports: [MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
})
export class SearchBoxComponent {
  public readonly store = inject(HeroesProvider);
  private readonly _heroesService = inject(HeroService);
  private readonly _loggerService = inject(LoggerService);
  private readonly route = inject(Router);
  public heroesQuery = signal<string[]>([]);
  public searchValue = signal('');
  public searchBoxForm = new FormGroup({
    searchBox: new FormControl('', {
      validators: [],
      nonNullable: true,
    }),
  });

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.heroesQuery.update(() => []);
    }
  }

  ngOnInit() {
    this.searchBoxForm
      .get('searchBox')
      ?.valueChanges.pipe(
        debounceTime(300),
        filter((value) => (value ?? '').length > 2),
        distinctUntilChanged(),
        tap((value) => {
          this.searchValue.update(() => value);
          this._loggerService.log(value);
        }),
        switchMap((value) =>
          this._heroesService.getHeroesByQueryParams(value as string)
        )
      )
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
          this._loggerService.error('Error fetching heroes', error);
          this.onClearFilter();
        },
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
  }

  onSelectedHero(heroName: string) {
    this._heroesService.getHeroByName(heroName).subscribe({
      next: (response) => {
        this.onClearFilter();
        this._loggerService.log('Successfully fetch selectedHero:', heroName);
        this.route.navigate(['hero', response.id]);
      },
      error: (error) => {
        this._loggerService.error('Error fetching hero by name', error);
      },
    });
  }

  onGetAllHeroesListed(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.heroesQuery().length === 0) {
      this._loggerService.error('No heroes selected', this.heroesQuery());
      return;
    }
    this.store.getHeroesByNames(this.heroesQuery());
    this.onClearFilter();
  }
}
