import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { ListService } from './list.service';
import { ResultSource } from '../models/resultSource';

@Injectable()
export class ResultSourceListService implements ListService {
  itemId: number = 1;
  itemsList: ResultSource[] = [];

  constructor(private messageService: MessageService) { }

  getItems(): ResultSource[] {
    return this.itemsList;
  }

  addItem(item: ResultSource): void {
    item.Id = this.itemId;
    this.itemsList.push(item);
    this.messageService.add('Item added');
    this.itemId++;
  }

  removeItem(item: ResultSource): void {
    let index = this.itemsList.indexOf(item, 0);
    if (index > -1) {
      this.itemsList.splice(index, 1);
    }
    this.messageService.add('Item removed');
  }

  resetItem(item: ResultSource){
    const originalItem = this.itemsList.find(i => i.Id == item.Id);
    Object.assign(originalItem, item);
    this.messageService.add('Item reseted');
  }

  editItem(item: ResultSource){
    let i = this.itemsList.indexOf(item, 0)
    this.itemsList[i] = item;
    this.messageService.add('Item edited');
  }
}
