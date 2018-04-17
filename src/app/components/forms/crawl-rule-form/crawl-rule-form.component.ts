import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { CrawlRule } from '../../../models/crawlRule';
import { CrawlRuleListService } from '../../../services/crawl-rule-list.service';
import { Rule } from '../../../models/enums/ruleEnum';

@Component({
  selector: 'app-crawl-rule-form',
  templateUrl: './crawl-rule-form.component.html',
  styleUrls: ['./crawl-rule-form.component.scss']
})
export class CrawlRuleFormComponent implements OnInit {
  item: CrawlRule = new CrawlRule();
  disableExclude: boolean;
  disableInclude: boolean;

  validationMessage: string;

  @Output() windowState = new EventEmitter<boolean>();

  constructor(private store: CrawlRuleListService) {
  }

  ngOnInit() {
  }

  clear() {
    this.item = null;
    this.item = new CrawlRule();
    this.validationMessage = null;
    this.disableExclude = false;
    this.disableInclude = false;
  }

  cancel() {
    this.windowState.emit(false);
  }

  onSubmit(form: any): void{
    if(form.valid) {
      if(this.item.Rule.toString() == "Exclude") {
        this.item.CrawlAsHttp = undefined;
        this.item.CrawlComplexUrls = undefined;
        this.item.FollowLinks = undefined;
      }
      if(this.item.Rule.toString() == "Include") { 
        this.item.ExcludeComplexUrls = undefined;
      }
      if(this.item.Regex == undefined || this.item.Regex == null) { this.item.Regex = false; }
      if(this.item.CrawlAsHttp == undefined || this.item.CrawlAsHttp == null) { this.item.CrawlAsHttp = false; }
      if(this.item.CrawlComplexUrls == undefined || this.item.CrawlComplexUrls == null) { this.item.CrawlComplexUrls = false; }
      if(this.item.ExcludeComplexUrls == undefined || this.item.ExcludeComplexUrls == null) { this.item.ExcludeComplexUrls = false; }
      if(this.item.FollowLinks == undefined || this.item.FollowLinks == null) { this.item.FollowLinks = false; }
      this.item.AccessMethod = "DefaultAccessMethod";

      this.addItem(this.item);  
        
      this.windowState.emit(false);
      this.clear();
    } else {
      this.validationMessage = "Enter required data";
    } 
  }

  addItem(item: CrawlRule){
    this.store.addItem(item);
  }

  onChange(ev) {
    console.log(ev.target.value);
    if(ev.target.value == "Exclude") {
      this.disableInclude = true;
      this.disableExclude = false;
    }
    else if(ev.target.value == "Include") {
      this.disableExclude = true;
      this.disableInclude = false;
    }
  }

  resetPriority(ev) {
    ev.preventDefault();
    this.item.Priority = undefined;
  }
}
