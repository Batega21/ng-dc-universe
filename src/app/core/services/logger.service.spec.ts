import { TestBed } from '@angular/core/testing';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log a message to the console', () => {
    const consoleLogSpy = spyOn(console, 'log');
    const message = 'Test message';
    service.log(message);
    expect(consoleLogSpy).toHaveBeenCalledWith(message);
  });

  it('should log a message with a parameter to the console', () => {
    const consoleLogSpy = spyOn(console, 'log');
    const message = 'Test message';
    const param = { key: 'value' };
    service.log(message, param);
    expect(consoleLogSpy).toHaveBeenCalledWith(message, param);
  });

  it('should log an error message to the console', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    const message = 'Test error message';
    const error = new Error('Test error');
    service.error(message, error);
    expect(consoleErrorSpy).toHaveBeenCalledWith(message, error);
  });

  it('should log a warning message to the console', () => {
    const consoleWarnSpy = spyOn(console, 'warn');
    const message = 'Test warning message';
    service.warn(message);
    expect(consoleWarnSpy).toHaveBeenCalledWith(message);
  });

  it('should log a debug message to the console and trigger debugger', () => {
    const consoleDebugSpy = spyOn(console, 'debug');
    const message = 'Test debug message';
    service.debugger(message);
    expect(consoleDebugSpy).toHaveBeenCalledWith(message);
  });

});
