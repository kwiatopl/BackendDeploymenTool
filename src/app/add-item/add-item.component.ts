import { Component, OnInit} from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ItemListService } from '../service/item-list.service';
import { ItemsListComponent } from '../items-list/items-list.component';
import { Item } from '../models/item';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  private itemCount: number = 1;
  item: Item;

  opened: boolean = false;
  isDraggable: boolean = false;
  isResizable: boolean = false;

  constructor(private store: ItemListService) { }

  ngOnInit() {
    this.clear();
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
    this.clear();
  }

  clear() {
    this.item = null;
    this.item = new Item();
  }

  submit() {
    this.item.Id = this.itemCount;
    this.addItem(this.item);
    this.itemCount++;
    
    this.opened = false;
    this.clear();
  }

  addItem(item: Item){
    this.store.addItem(item);
 }
}
