import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { ContentSourceListService } from '../service/content-source-list.service';
import { ContentSource } from '../models/contentSource';
import { ContentSourceFormComponent } from '../content-source-form/content-source-form.component';
import { ItemType } from '../models/itemTypeEnum';

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
  private formComponent: ContentSourceFormComponent;

  constructor(private store: ContentSourceListService) { }

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
    this.formComponent.clear();
  }
}
