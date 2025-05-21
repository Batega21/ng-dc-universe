import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  public log(message: string, param?: any): void {
    if (param) {
      console.log(message, param);
    } else {
      console.log(message);
    }
  }

  public error(message: string, error: any): void {
    console.error(message, error);
  }
  
  public warn(message: string): void {
    console.warn(message);
  }
  
  public debugger(message: string): void {
    debugger;
    console.debug(message);
  }
}
