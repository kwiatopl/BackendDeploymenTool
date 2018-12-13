import { Injectable } from '@angular/core';
import { Timeouts } from 'selenium-webdriver';

@Injectable()
export class MessageService {
  message: string = "";
  timeout: any = "";

  add(message: string) {
    clearTimeout(this.timeout);
    this.clear();
    this.message = message;
    this.timeout = setTimeout(() => {this.clear()}, 3000);
  }

  clear() 
  {
    this.message = "";
  }
}
