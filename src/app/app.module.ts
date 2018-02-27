import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsModule} from '@progress/kendo-angular-buttons';
import { PopupModule } from '@progress/kendo-angular-popup';
import { WindowModule } from '@progress/kendo-angular-dialog';

import { AppComponent } from './app.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ItemListService } from './service/item-list.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './service/message.service';

@NgModule({
  declarations: [
    AppComponent,
    ItemsListComponent,
    AddItemComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule, 
    GridModule,
    ButtonsModule,
    PopupModule,
    WindowModule
  ],
  providers: [ItemListService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
