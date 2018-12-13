import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ResultSource } from '../../../models/resultSource';
import { ResultSourceListService } from '../../../services/result-source-list.service';
import { ResultSourceType } from '../../../models/enums/rsTypeEnum';

@Component({
  selector: 'app-result-source-form',
  templateUrl: './result-source-form.component.html',
  styleUrls: ['./result-source-form.component.scss']
})
export class ResultSourceFormComponent implements OnInit {
  item: ResultSource = new ResultSource();
  remote: boolean = false;
  types: Array<string> = [ResultSourceType.LocalSharepoint, ResultSourceType.LocalPeople, ResultSourceType.RemoteSharepoint, ResultSourceType.RemotePeople, ResultSourceType.OpenSearch, ResultSourceType.Exchange];
  
  validationMessage: string;

  @Output() windowState = new EventEmitter<boolean>();

  constructor(private store: ResultSourceListService) {
  }

  ngOnInit() {
  }

  clear() {
    this.item = null;
    this.item = new ResultSource();
    this.validationMessage = null;
  }

  cancel() {
    this.windowState.emit(false);
  }

  onSubmit(form: any): void{
    if(form.valid) {
      if(!this.remote) { this.item.RemoteUrl = undefined; }; 

      this.addItem(this.item);  
        
      this.windowState.emit(false);
      this.clear();
    } else {
      this.validationMessage = "Enter required data";
    } 
  }

  addItem(item: ResultSource){
    this.store.addItem(item);
  }

  onTypeChange(value) {
    console.log("Type change");
    if(value == ResultSourceType.LocalPeople || value == ResultSourceType.LocalSharepoint) {
      this.remote = false;
    }
    else if(value == ResultSourceType.RemoteSharepoint || value == ResultSourceType.RemotePeople || value == ResultSourceType.Exchange || value == ResultSourceType.OpenSearch ) {
      this.remote = true;
    }
  }
}