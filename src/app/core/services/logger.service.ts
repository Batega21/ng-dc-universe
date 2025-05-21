import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  log(message: string, param?: any): void {
    if (param) {
      console.log(message, param);
    } else {
      console.log(message);
    }
  }
  error(message: string, error: any): void {
    console.error(message, error);
  }
  warn(message: string): void {
    console.warn(message);
  }
  debugger(message: string): void {
    debugger;
    console.debug(message);
  }
}
