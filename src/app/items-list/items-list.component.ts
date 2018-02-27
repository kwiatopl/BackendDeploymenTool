import { Component, OnInit } from '@angular/core';
import { Item } from '../models/item';
import { ItemListService } from '../service/item-list.service';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent implements OnInit {
  items: Item[];

  constructor(private store: ItemListService) {
  }

  ngOnInit() {
    this.getItems();
  }

  getItems(): void {
    this.items = this.store.getItems();
  }

  removeItem({dataItem}){
    this.store.removeItem(dataItem);
  }
}