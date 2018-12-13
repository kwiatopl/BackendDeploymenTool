import { Injectable } from '@angular/core';
import { ManagedProperty } from '../models/managedProperty';
import { MessageService } from './message.service';
import { ListService } from './list.service';

@Injectable()
export class SearchSchemaListService implements ListService {
  itemId: number = 1;
  itemsList: ManagedProperty[] = [];

  constructor(private messageService: MessageService) { }

  getItems(): ManagedProperty[] {
    return this.itemsList;
  }

  addItem(item: ManagedProperty): void {
    item.Id = this.itemId;
    this.itemsList.push(item);
    this.messageService.add('Item added');
    this.itemId++;
  }

  removeItem(item: ManagedProperty): void {
    let index = this.itemsList.indexOf(item, 0);
    if (index > -1) {
      this.itemsList.splice(index, 1);
    }
    this.messageService.add('Item removed');
  }

  resetItem(item: ManagedProperty){
    const originalItem = this.itemsList.find(i => i.Id == item.Id);
    Object.assign(originalItem, item);
    this.messageService.add('Item reseted');
  }

  editItem(item: ManagedProperty){
    let i = this.itemsList.indexOf(item, 0)
    this.itemsList[i] = item;
    this.messageService.add('Item edited');
  }
}
