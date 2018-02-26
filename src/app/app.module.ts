import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ItemListService } from './service/item-list.service';


@NgModule({
  declarations: [
    AppComponent,
    ItemsListComponent,
    AddItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [ItemListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
