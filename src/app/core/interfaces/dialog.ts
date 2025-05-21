import { Hero } from "./hero";

export interface DialogData {
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  confirmButtonIcon: string;
  cancelButtonIcon: string;
  hero?: Hero | null;
  actionType?: string;
  actionCallback?: null;
}