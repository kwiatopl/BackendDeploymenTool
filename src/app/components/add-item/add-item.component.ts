import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { ContentSourceListService } from '../../services/content-source-list.service';
import { ContentSourceFormComponent } from '../forms/content-source-form/content-source-form.component';
import { CrawlRuleFormComponent } from '../forms/crawl-rule-form/crawl-rule-form.component';
import { CrawlRuleListService } from '../../services/crawl-rule-list.service';
import { SearchSchemaFormComponent } from '../forms/search-schema-form/search-schema-form.component';
import { SearchSchemaListService } from '../../services/search-schema-list.service';
import { ResultSourceListService } from '../../services/result-source-list.service';
import { ResultSourceFormComponent } from '../forms/result-source-form/result-source-form.component'
import { ItemType } from '../../models/enums/itemTypeEnum';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  opened: boolean = false;
  isDraggable: boolean = false;
  isResizable: boolean = true;
  width: number = 400;

  @Input() itemType: ItemType;

  @ViewChild(ContentSourceFormComponent)
  private csComponent: ContentSourceFormComponent;
  @ViewChild(CrawlRuleFormComponent)
  private crComponent: CrawlRuleFormComponent;
  @ViewChild(SearchSchemaFormComponent)
  private ssComponent: SearchSchemaFormComponent;
  @ViewChild(ResultSourceFormComponent)
  private rsComponent: ResultSourceFormComponent;

  constructor(private csStore: ContentSourceListService, private crStore: CrawlRuleListService, private ssStore: SearchSchemaListService, private rsStore: ResultSourceListService) { }

  ngOnInit() {
  }

  windowState(state: boolean){
    if(state == false) this.opened = false;
  }

  open() {
    this.opened = true;
    if (this.itemType === ItemType.ContentSource) {
      this.width = 450;
    }
    else if (this.itemType === ItemType.CrawlRule) {
      this.width = 500;
    }
    else if (this.itemType === ItemType.SearchSchema) {
      this.width = 600;
    }
    else if(this.itemType === ItemType.ResultSource) {
      this.width = 400;
    }
  }

  close() {
    this.opened = false;
    if( this.itemType === ItemType.ContentSource ) {
      this.crComponent.clear();
    }
    if( this.itemType === ItemType.CrawlRule ) {
      this.csComponent.clear();
    }
    if( this.itemType === ItemType.SearchSchema ) {
      this.ssComponent.clear();
    }
    if( this.itemType === ItemType.ResultSource ) {
      this.rsComponent.clear();
    }
  }
}