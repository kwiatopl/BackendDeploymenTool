import { Injectable } from '@angular/core';
import { Item } from '../models/item';
<<<<<<< HEAD

@Injectable()
export class ItemListService {
  itemsList: Item[];

  constructor() { 
    this.itemsList = [];
  }

  getItems(): Item[] {
=======
import { MessageService } from './message.service';

@Injectable()
export class ItemListService {
  itemsList: Item[] = [];

  constructor(private messageService: MessageService) { }

  getItems(): Item[] {
    this.messageService.add('Items fetched');
>>>>>>> 367356f248bece0bc0b9c911face9a309fe050ed
    return this.itemsList;
  }

  addItem(item: Item): void {
    this.itemsList.push(item);
<<<<<<< HEAD
  }

=======
    this.messageService.add('Item added');
  }

  removeItem(item: Item): void {
    let index = this.itemsList.indexOf(item, 0);
    if (index > -1) {
      this.itemsList.splice(index, 1);
    }
    this.messageService.add('Item removed');
  }
>>>>>>> 367356f248bece0bc0b9c911face9a309fe050ed
}
