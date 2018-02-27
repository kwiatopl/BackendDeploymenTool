import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { MessageService } from './message.service';

@Injectable()
export class ItemListService {
  itemsList: Item[] = [];

  constructor(private messageService: MessageService) { }

  getItems(): Item[] {
    this.messageService.add('Items fetched');
    return this.itemsList;
  }

  addItem(item: Item): void {
    this.itemsList.push(item);
    this.messageService.add('Item added');
  }

  removeItem(item: Item): void {
    let index = this.itemsList.indexOf(item, 0);
    if (index > -1) {
      this.itemsList.splice(index, 1);
    }
    this.messageService.add('Item removed');
  }
}
