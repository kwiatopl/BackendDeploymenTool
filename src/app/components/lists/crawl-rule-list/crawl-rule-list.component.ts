import { Component, OnInit } from '@angular/core';
import { CrawlRule } from '../../../models/crawlRule';
import { ItemType } from '../../../models/enums/itemTypeEnum';
import { CrawlRuleListService } from '../../../services/crawl-rule-list.service'; 

@Component({
  selector: 'app-crawl-rule-list',
  templateUrl: './crawl-rule-list.component.html',
  styleUrls: ['./crawl-rule-list.component.scss']
})
export class CrawlRuleListComponent implements OnInit {
  items: CrawlRule[];
  itemToEdit: CrawlRule;
  private editedRowIndex: number;
  private editedItem: CrawlRule;
  itemType: ItemType = ItemType.CrawlRule;
  disableInclude: boolean = false;
  disableExclude: boolean = false;

  constructor(private store: CrawlRuleListService) {
  }

  ngOnInit() {
    this.getItems();
    let key = <HTMLElement>document.body.querySelector("#crawl-rule-list");
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

    if( this.editedItem.Rule.toString() == "Exclude") { this.disableInclude = true; this.disableExclude = false; }
    if( this.editedItem.Rule.toString() == "Include") { this.disableExclude = true; this.disableInclude = false; }

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
