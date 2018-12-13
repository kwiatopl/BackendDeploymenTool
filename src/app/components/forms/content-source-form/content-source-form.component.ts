import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { ContentSourceListService } from '../../../services/content-source-list.service';
import { ContentSource } from '../../../models/contentSource';
import { ContentSourceType } from '../../../models/enums/csTypeEnum';
import { Behavior } from '../../../models/enums/behaviorEnum';
import { Proxy } from '../../../models/enums/proxyEnum';
import { Priority } from '../../../models/enums/priorityEnum';

@Component({
  selector: 'app-content-source-form',
  templateUrl: './content-source-form.component.html',
  styleUrls: ['./content-source-form.component.scss']
})
export class ContentSourceFormComponent implements OnInit {
  item: ContentSource = new ContentSource();
  types: Array<string> = [ContentSourceType[0], ContentSourceType[1], ContentSourceType[2]];
  behaviors: Array<string> = [Behavior[0], Behavior[1]];
  proxies: Array<string> = [Proxy[0], Proxy[1]];
  priorities: Array<string> = [Priority[1], Priority[2]];
  pageDepth: number;
  siteDepth: number;
  type: string;

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
    this.type = null;
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
      if(this.item.Continuous == undefined || this.item.Continuous == null) {
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

  onTypeChange(value) {
    this.type = value; 
  }

  resetDepth(ev) {
    ev.preventDefault();
    this.item.PageEnumeration = undefined;
    this.item.SiteEnumeration = undefined;
  }
}
