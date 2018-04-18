import { Component, OnInit } from '@angular/core';
import { ResultSource } from '../../../models/resultSource';
import { ItemType } from '../../../models/enums/itemTypeEnum';
import { ResultSourceListService } from '../../../services/result-source-list.service'; 
import { ResultSourceType } from '../../../models/enums/rsTypeEnum';

@Component({
  selector: 'app-result-source-list',
  templateUrl: './result-source-list.component.html',
  styleUrls: ['./result-source-list.component.scss']
})
export class ResultSourceListComponent implements OnInit {
  items: ResultSource[];
  itemToEdit: ResultSource;
  private editedRowIndex: number;
  private editedItem: ResultSource;
  itemType: ItemType = ItemType.ResultSource;
  remote: boolean = false;

  constructor(private store: ResultSourceListService) {
  }

  ngOnInit() {
    this.getItems();
    let key = <HTMLElement>document.body.querySelector("#result-source-list");
    key.addEventListener("keydown", (ev) => { if(ev.keyCode === 13) {ev.preventDefault(); return false;}});
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

    if(this.editedItem.Type == ResultSourceType.LocalPeople || this.editedItem.Type == ResultSourceType.LocalSharepoint) { this.remote = false; }
    if(this.editedItem.Type == ResultSourceType.RemotePeople || 
      this.editedItem.Type == ResultSourceType.RemoteSharepoint || 
      this.editedItem.Type == ResultSourceType.OpenSearch || 
      this.editedItem.Type == ResultSourceType.Exchange ) 
      { this.remote = true; }

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
