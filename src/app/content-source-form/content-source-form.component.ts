import { Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import { ItemListService } from '../service/item-list.service';
import { Item } from '../models/item';
import { NgForm, NgModel } from '@angular/forms';
import { AddItemComponent } from '../add-item/add-item.component';

@Component({
  selector: 'app-content-source-form',
  templateUrl: './content-source-form.component.html',
  styleUrls: ['./content-source-form.component.scss']
})
export class ContentSourceFormComponent implements OnInit {
  item: Item = new Item();
  types: Array<string> = ["Sharepoint", "Web", "Business"];

  validationMessage: string;

  @Output() windowState = new EventEmitter<boolean>();

  constructor(private store: ItemListService) {
  }

  ngOnInit() {
  }

  clear() {
    this.item = null;
    this.item = new Item();
    this.validationMessage = null;
  }

  cancel() {
    this.windowState.emit(false);
  }

  onSubmit(form: any): void{
    if(form.valid) {
      this.addItem(this.item);  
      
      this.windowState.emit(false);
      this.clear();
    } else {
      this.validationMessage = "Enter required data";
    } 
  }

  addItem(item: Item){
    this.store.addItem(item);
  }
}
