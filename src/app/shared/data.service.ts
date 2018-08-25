import { Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


@Injectable({ providedIn: 'root' })
export class DataService {

  messageSource = new BehaviorSubject<string>('');

  currentMessage = this.messageSource.asObservable();

  constructor() {}

  changeMessage(message: string) {
    console.log('DataService.changeMessage: ' + message);
    this.messageSource.next(message);
  }

}
