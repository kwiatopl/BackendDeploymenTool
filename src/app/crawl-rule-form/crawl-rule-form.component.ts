import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { CrawlRule } from '../models/crawlRule';
import { CrawlRuleListService } from '../service/crawl-rule-list.service';

@Component({
  selector: 'app-crawl-rule-form',
  templateUrl: './crawl-rule-form.component.html',
  styleUrls: ['./crawl-rule-form.component.scss']
})
export class CrawlRuleFormComponent implements OnInit {
  item: CrawlRule = new CrawlRule();

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
  }

  cancel() {
    this.windowState.emit(false);
  }

  onSubmit(form: any): void{
    if(form.valid) {
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
}
