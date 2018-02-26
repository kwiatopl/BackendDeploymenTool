import { Component, OnInit} from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ItemListService } from '../service/item-list.service';
import { ItemsListComponent } from '../items-list/items-list.component';
import { Item } from '../models/item';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  name: string;
  ssa: string;
  type: string;
  newItem: Item;
  idNumber: number = 1;

  constructor(private store: ItemListService) { }

  ngOnInit() {
  }

  onClick() {
    this.newItem = new Item;
    this.newItem.id = this.idNumber;
    this.idNumber++;
    this.newItem.name = this.name;
    this.newItem.ssa = this.ssa;
    this.newItem.type = this.type;

    this.addItem(this.newItem);
  }

  addItem(item){
    this.store.addItem(item);
 }


}
