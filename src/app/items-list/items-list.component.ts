import { Component, OnInit } from '@angular/core';
import { Item } from '../models/item';
import { ItemListService } from '../service/item-list.service';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {
  newItem: Item;
  items: Item[];

  constructor(private store: ItemListService) {
    this.store = store;
   }

  ngOnInit() {
    this.getItems();
  }

  getItems(): Item[] {
    this.items = this.store.getItems(); 
    return this.items;
  }

  addItem(item){
     this.store.addItem(item);
  }

}
