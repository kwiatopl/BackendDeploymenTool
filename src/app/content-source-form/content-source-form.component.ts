import { Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import { ContentSourceListService } from '../service/content-source-list.service';
import { ContentSource } from '../models/contentSource';
import { NgForm, NgModel } from '@angular/forms';
import { AddItemComponent } from '../add-item/add-item.component';

@Component({
  selector: 'app-content-source-form',
  templateUrl: './content-source-form.component.html',
  styleUrls: ['./content-source-form.component.scss']
})
export class ContentSourceFormComponent implements OnInit {
  item: ContentSource = new ContentSource();
  types: Array<string> = ["Sharepoint", "Web", "Business"];

  validationMessage: string;

  @Output() windowState = new EventEmitter<boolean>();

  constructor(private store: ContentSourceListService) {
  }

  ngOnInit() {
  }

  clear() {
    this.item = null;
    this.item = new ContentSource();
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

  addItem(item: ContentSource){
    this.store.addItem(item);
  }
}
