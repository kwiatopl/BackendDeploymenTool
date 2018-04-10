import { Component, OnInit} from '@angular/core';
import { ContentSource } from '../models/contentSource';
import { ContentSourceListService } from '../service/content-source-list.service';
import { AddItemComponent } from '../add-item/add-item.component';
import { ItemType } from '../models/itemTypeEnum';

@Component({
  selector: 'app-content-source-list',
  templateUrl: './content-source-list.component.html',
  styleUrls: ['./content-source-list.component.scss']
})
export class ContentSourceListComponent implements OnInit {
  items: ContentSource[];
  itemToEdit: ContentSource;
  private editedRowIndex: number;
  private editedItem: ContentSource;
  itemType: ItemType = ItemType.ContentSource;
  disableWeb: boolean;
  disableSharepoint: boolean;
  disableBusiness: boolean;

  constructor(private store: ContentSourceListService) {
  }

  ngOnInit() {
    this.getItems();
    let key = <HTMLElement>document.body.querySelector("#content-source-list");
    if(key) {
      key.addEventListener("keydown", (ev) => { if(ev.keyCode === 13) {ev.preventDefault(); return false;}});
    }
  }

  getItems(): void {
    this.items = this.store.getItems();
  }

  removeItem({dataItem}){
    this.store.removeItem(dataItem);
  }

  editHandler({sender, rowIndex, dataItem}){
    this.closeEditor(sender);

    this.editedRowIndex = rowIndex;
    this.editedItem = Object.assign({}, dataItem);
    
    if(this.editedItem.Type.toString() == "Sharepoint") {
      this.disableBusiness = true;
      this.disableWeb = true;
      this.disableSharepoint = false;
    }
    if(this.editedItem.Type.toString() == "Web") {
      this.disableSharepoint = true;
      this.disableWeb = false;
      this.disableBusiness = true;
    }
    if(this.editedItem.Type.toString() == "Business") {
      this.disableSharepoint = true;
      this.disableWeb = true;
      this.disableBusiness = false;
    } 

    sender.editRow(rowIndex);
  }

  saveHandler({sender, rowIndex, dataItem}) {
    this.editedItem = undefined;
    this.store.editItem(dataItem);
    sender.closeRow(rowIndex);
  }

  cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
      
    if(this.editedItem){
    this.store.resetItem(this.editedItem);
    }

    this.editedRowIndex = undefined;
    this.editedItem = undefined;
  }

  onStateChange(){
    this.getItems();
  }
}
