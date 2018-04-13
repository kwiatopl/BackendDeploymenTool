import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { ContentSourceListService } from '../../services/content-source-list.service';
import { ContentSourceFormComponent } from '../forms/content-source-form/content-source-form.component';
import { CrawlRuleFormComponent } from '../forms/crawl-rule-form/crawl-rule-form.component';
import { CrawlRuleListService } from '../../services/crawl-rule-list.service';
import { SearchSchemaFormComponent } from '../forms/search-schema-form/search-schema-form.component';
import { SearchSchemaListService } from '../../services/search-schema-list.service';
import { ItemType } from '../../models/enums/itemTypeEnum';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  opened: boolean = false;
  isDraggable: boolean = false;
  isResizable: boolean = false;

  @Input() itemType: ItemType;

  @ViewChild(ContentSourceFormComponent)
  private csComponent: ContentSourceFormComponent;
  @ViewChild(CrawlRuleFormComponent)
  private crComponent: CrawlRuleFormComponent;
  @ViewChild(CrawlRuleFormComponent)
  private ssComponent: SearchSchemaFormComponent;

  constructor(private csStore: ContentSourceListService, private crStore: CrawlRuleListService, private ssStore: SearchSchemaListService) { }

  ngOnInit() {
  }

  windowState(state: boolean){
    if(state == false) this.opened = false;
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
    this.crComponent.clear();
    this.csComponent.clear();
    this.ssComponent.clear();
  }
}
