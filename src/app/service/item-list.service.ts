import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { MessageService } from './message.service';

@Injectable()
export class ItemListService {
  itemId: number = 1;
  itemsList: Item[] = [];

  constructor(private messageService: MessageService) { }

  getItems(): Item[] {
    this.messageService.add('Items fetched');
    return this.itemsList;
  }

  addItem(item: Item): void {
    item.Id = this.itemId;
    this.itemsList.push(item);
    this.messageService.add('Item added');
    this.itemId++;
  }

  removeItem(item: Item): void {
    let index = this.itemsList.indexOf(item, 0);
    if (index > -1) {
      this.itemsList.splice(index, 1);
    }
    this.messageService.add('Item removed');
  }

  resetItem(item: Item){
    const originalItem = this.itemsList.find(i => i.Id == item.Id);
    Object.assign(originalItem, item);
  }

  editItem(item: Item){
    let i = this.itemsList.indexOf(item, 0)
    this.itemsList[i] = item;
  }
}
