import { Component, HostListener, inject, signal, ViewChild } from '@angular/core';
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
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-search-box',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, ReactiveFormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
})
export class SearchBoxComponent {
  public readonly store = inject(HeroesProvider);
  private readonly _heroesService = inject(HeroService);
  private readonly _loggerService = inject(LoggerService);
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
        tap((value) => this.searchValue.update(() => value)),
        switchMap((value) =>
          this._heroesService.getHeroesByQueryParams(value as string)
        )
      )
      .subscribe({
        next: (response) => {
          this._loggerService.log('🚀 ~ response:', response);
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
    console.log('🚀 ~ getSelectedHero call:', heroName);
  }
}
