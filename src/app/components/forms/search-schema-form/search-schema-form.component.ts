import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ManagedProperty } from '../../../models/managedProperty';
import { SearchSchemaListService } from '../../../services/search-schema-list.service';
import { ManagedPropertyType } from '../../../models/enums/mpTypeEnum';
import { Sortable } from '../../../models/enums/sortableEnum';
import { Refinable } from '../../../models/enums/refinableEnum';

@Component({
  selector: 'app-search-schema-form',
  templateUrl: './search-schema-form.component.html',
  styleUrls: ['./search-schema-form.component.scss']
})
export class SearchSchemaFormComponent implements OnInit {
  item: ManagedProperty = new ManagedProperty();
  types: Array<string> = [
    ManagedPropertyType[0], 
    ManagedPropertyType[1], 
    ManagedPropertyType[2],
    ManagedPropertyType[3],
    ManagedPropertyType[4],
    ManagedPropertyType[5],
    ManagedPropertyType[6]];
  refinables: Array<string> = [Refinable[0], Refinable[1], Refinable[2]]; 
  sortables: Array<string> = [Sortable[0], Sortable[1], Sortable[2]];

  validationMessage: string;

  @Output() windowState = new EventEmitter<boolean>();

  constructor(private store: SearchSchemaListService) {
  }

  ngOnInit() {
  }

  clear() {
    this.item = null;
    this.item = new ManagedProperty();
    this.validationMessage = null;
  }

  clearMapping() {
    this.item.Mapping = null;
    this.validationMessage = null;
  }

  cancel() {
    this.windowState.emit(false);
  }

  onSubmit(form: any): void{
    if(form.valid) {
      if(this.item.Searchable == undefined || this.item.Searchable == null) { this.item.Searchable = false }
      if(this.item.Queryable == undefined || this.item.Queryable == null) { this.item.Queryable = false }
      if(this.item.Retrievable == undefined || this.item.Retrievable == null) { this.item.Retrievable = false }
      if(this.item.MultiValue == undefined || this.item.MultiValue == null) { this.item.MultiValue = false }
      if(this.item.Safe == undefined || this.item.Safe == null) { this.item.Safe = false }
      if(this.item.Token == undefined || this.item.Token == null) { this.item.Token = false }
      if(this.item.Complete == undefined || this.item.Complete == null) { this.item.Complete = false }

      this.addItem(this.item);  
        
      this.windowState.emit(false);
      this.clear();
    } else {
      this.validationMessage = "Enter required data";
    } 
  }

  addItem(item: ManagedProperty){
    this.store.addItem(item);
  }
}
