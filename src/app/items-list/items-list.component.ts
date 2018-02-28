import { Component, OnInit} from '@angular/core';
import { Item } from '../models/item';
import { ItemListService } from '../service/item-list.service';
import { AddItemComponent } from '../add-item/add-item.component';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent implements OnInit {
  items: Item[];
  itemToEdit: Item;
  private editedRowIndex: number;
  private editedItem: Item;

  constructor(private store: ItemListService) {
  }

  ngOnInit() {
    this.getItems();
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
