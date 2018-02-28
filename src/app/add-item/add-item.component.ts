import { Component, OnInit, ViewChild} from '@angular/core';
import { ItemListService } from '../service/item-list.service';
import { Item } from '../models/item';
import { ContentSourceFormComponent } from '../content-source-form/content-source-form.component';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  opened: boolean = false;
  isDraggable: boolean = false;
  isResizable: boolean = false;

  @ViewChild(ContentSourceFormComponent)
  private formComponent: ContentSourceFormComponent;

  constructor(private store: ItemListService) { }

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
