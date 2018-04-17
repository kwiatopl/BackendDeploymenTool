import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchSchemaListService } from '../../../services/search-schema-list.service';
import { SearchSchemaFormComponent } from '../search-schema-form/search-schema-form.component';
import { Category } from '../../../models/enums/categoryEnum';
import { ManagedProperty } from '../../../models/managedProperty';
import { Mapping } from '../../../models/mapping';

@Component({
  selector: 'app-mapping-form',
  templateUrl: './mapping-form.component.html',
  styleUrls: ['./mapping-form.component.scss']
})
export class MappingFormComponent implements OnInit {
  opened: boolean = false;
  isDraggable: boolean = false;
  isResizable: boolean = false;
  properties: Array<string>;
  crawledProperties: string;
  mapping: Mapping = new Mapping();
  categories: Array<string> = [
    Category[0],
    Category[1],
    Category[2],
    Category[3],
    Category[4],
    Category[5],
    Category[6],
    Category[7],
    Category[8],
    Category[9],
    Category[10],
    Category[11],
    Category[12],
  ]; 

  validationMessage: string;

  @Output() addMapping: EventEmitter<Mapping> = new EventEmitter<Mapping>();

  constructor() { }

  ngOnInit() {
  }

  clear() {
    this.mapping = null;
    this.mapping = new Mapping();
    this.validationMessage = null;
    this.crawledProperties = null;
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }

  parseProperties(data: string) {
    let propertiesArray: Array<string> = [];
    (data.split(",").forEach( el => { 
      propertiesArray.push(el.trim());
    })); 
    return propertiesArray;
  }

  onSubmit(form: any): void {
    if(form.valid) {
      this.mapping.CrawledProperties = this.parseProperties(this.crawledProperties);

      this.addMapping.emit(this.mapping);

      this.close();
      this.clear();
    }
    else {
      this.validationMessage = "Enter required data";
    } 

  }

  add() {
  }
}
