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
  priorities: Array<string> = [Priority[1], Priority[2]];
  pageDepth: number;
  siteDepth: number;

  customProxy: boolean;
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
      if(this.item.Type.toString() !== "Sharepoint") { 
        //!Sharepoint
        this.item.Behavior = undefined;
      }
      if(this.item.Type.toString() !== "Web") { 
        //!Web
        this.item.PageEnumeration = undefined;
        this.item.SiteEnumeration = undefined;
      }
      if(this.item.Type.toString() !== "Business") { 
        //!Business
        this.item.ProxyGroup = undefined;
        this.item.Proxy = undefined;
        this.item.LOBSystem = undefined;
      }
      if(this.item.Type.toString() == "Business") {
        if(this.item.ProxyGroup.toString() == "Default") {
          this.item.Proxy = "Default";
          this.item.LOBSystem.trim();
        } 
      }
      if(this.item.Continuous == undefined) {
        this.item.Continuous = false;
      }

      this.item.Address.trim();

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

  onDepthClick(ev) {
    if(ev.target.value == "Server") {
      this.customDepth = false;
      this.item.SiteEnumeration = 0;
      this.item.PageEnumeration = undefined;
    }
    else if (ev.target.value == "Page") {
      this.customDepth = false;
      this.item.SiteEnumeration = 0;
      this.item.PageEnumeration = 0;
    }
    else if (ev.target.value == "Custom") {
      this.item.SiteEnumeration = undefined;
      this.item.PageEnumeration = undefined;
      this.customDepth = true;
    }
  }
}
