import { Component, OnInit, Input } from '@angular/core';
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
  properties: Array<string>
  crawledProperties: string;
  category: Category;
  action: string;
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

  @Input() mapping: Array<Mapping>;

  constructor() { }

  ngOnInit() {
  }

  clear() {
    this.action = undefined;
    this.category = undefined;
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
    this.category = undefined;
    this.action = undefined;
  }

  add() {
    close();
  }
}
