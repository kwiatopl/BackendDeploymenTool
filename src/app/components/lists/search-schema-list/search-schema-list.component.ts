import { Component, OnInit} from '@angular/core';
import { ManagedProperty } from '../../../models/managedProperty';
import { SearchSchemaListService } from '../../../services/search-schema-list.service';
import { AddItemComponent } from '../../add-item/add-item.component';
import { ItemType } from '../../../models/enums/itemTypeEnum';

@Component({
  selector: 'app-search-schema-list',
  templateUrl: './search-schema-list.component.html',
  styleUrls: ['./search-schema-list.component.scss']
})
export class SearchSchemaListComponent implements OnInit {
  items: ManagedProperty[];
  itemToEdit: ManagedProperty;
  private editedRowIndex: number;
  private editedItem: ManagedProperty;
  itemType: ItemType = ItemType.SearchSchema;

  constructor(private store: SearchSchemaListService) {
  }

  ngOnInit() {
    this.getItems();
    let key = <HTMLElement>document.body.querySelector("#search-schema-list");
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
