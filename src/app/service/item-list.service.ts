import { Injectable } from '@angular/core';
import { Item } from '../models/item';

@Injectable()
export class ItemListService {
  itemsList: Item[];

  constructor() { 
    this.itemsList = [];
  }

  getItems(): Item[] {
    return this.itemsList;
  }

  addItem(item: Item): void {
    this.itemsList.push(item);
  }

}
