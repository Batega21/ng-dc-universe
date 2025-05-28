import { Component, EventEmitter, inject, model, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogData } from '../../core/interfaces/dialog';
import { HeroesStore } from '../../state/hero.store';

@Component({
  selector: 'app-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatIconModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class HeroDialog {
  readonly store = inject(HeroesStore);
  readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<HeroDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  public title = model(this.data.title);
  public message = model(this.data.message);
  public confirmButtonText = model(this.data.confirmButtonText);
  public cancelButtonText = model(this.data.cancelButtonText);
  public confirmButtonIcon = model(this.data.confirmButtonIcon);
  public cancelButtonIcon = model(this.data.cancelButtonIcon);
  @Output() public confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

  onNoClick(): void {
    this.dialogRef.close();
    this.confirmed.emit(false);
  }

  onConfirm(): void {
    if (this.data.hero) {
      if (this.data.actionType === 'edit') {
        this.store.updateHero(this.data.hero);
      } else if (this.data.actionType === 'add') {
        this.store.addHero(this.data.hero);
      }
    }
    
    this.confirmed.emit(true);
    this.dialogRef.close();
  }

}
