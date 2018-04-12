import { Injectable } from '@angular/core';
import { CrawlRule } from '../models/crawlRule';
import { MessageService } from './message.service';
import { ListService } from './list.service';

@Injectable()
export class CrawlRuleListService implements ListService {
  itemId: number = 1;
  itemsList: CrawlRule[] = [];

  constructor(private messageService: MessageService) { }

  getItems(): CrawlRule[] {
    return this.itemsList;
  }

  addItem(item: CrawlRule): void {
    item.Id = this.itemId;
    this.itemsList.push(item);
    this.messageService.add('Item added');
    this.itemId++;
  }

  removeItem(item: CrawlRule): void {
    let index = this.itemsList.indexOf(item, 0);
    if (index > -1) {
      this.itemsList.splice(index, 1);
    }
    this.messageService.add('Item removed');
  }

  resetItem(item: CrawlRule){
    const originalItem = this.itemsList.find(i => i.Id == item.Id);
    Object.assign(originalItem, item);
    this.messageService.add('Item reseted');
  }

  editItem(item: CrawlRule){
    let i = this.itemsList.indexOf(item, 0)
    this.itemsList[i] = item;
    this.messageService.add('Item edited');
  }
}
