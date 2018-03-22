import { Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import { ContentSourceListService } from '../service/content-source-list.service';
import { ContentSource } from '../models/contentSource';
import { NgForm, NgModel } from '@angular/forms';
import { AddItemComponent } from '../add-item/add-item.component';
import { Type } from '../models/typeEnum';
import { Behavior } from '../models/behaviorEnum';
import { Proxy } from '../models/proxyEnum';
import { Priority } from '../models/priorityEnum';

@Component({
  selector: 'app-content-source-form',
  templateUrl: './content-source-form.component.html',
  styleUrls: ['./content-source-form.component.scss']
})
export class ContentSourceFormComponent implements OnInit {
  item: ContentSource = new ContentSource();
  types: Array<string> = [Type[0], Type[1], Type[2]];
  behaviors: Array<string> = [Behavior[0], Behavior[1]];
  proxies: Array<string> = [Proxy[0], Proxy[1]];
  priorities: Array<string> = [Priority[0], Priority[1]];

  customDepth: boolean;

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
