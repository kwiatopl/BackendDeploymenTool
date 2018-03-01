import { Injectable } from '@angular/core';
import { ContentSource } from '../models/contentSource';
import { MessageService } from './message.service';

@Injectable()
export class ContentSourceListService {
  itemId: number = 1;
  itemsList: ContentSource[] = [];

  constructor(private messageService: MessageService) { }

  getItems(): ContentSource[] {
    return this.itemsList;
  }

  addItem(item: ContentSource): void {
    item.Id = this.itemId;
    this.itemsList.push(item);
    this.messageService.add('Item added');
    this.itemId++;
  }

  removeItem(item: ContentSource): void {
    let index = this.itemsList.indexOf(item, 0);
    if (index > -1) {
      this.itemsList.splice(index, 1);
    }
    this.messageService.add('Item removed');
  }

  resetItem(item: ContentSource){
    const originalItem = this.itemsList.find(i => i.Id == item.Id);
    Object.assign(originalItem, item);
  }

  editItem(item: ContentSource){
    let i = this.itemsList.indexOf(item, 0)
    this.itemsList[i] = item;
    this.messageService.add('Item edited');
  }
}
