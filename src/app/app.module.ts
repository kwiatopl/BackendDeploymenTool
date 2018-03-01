import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsModule} from '@progress/kendo-angular-buttons';
import { PopupModule } from '@progress/kendo-angular-popup';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ContentSourceListComponent } from './items-list/content-source-list.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ContentSourceListService } from './service/content-source-list.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './service/message.service';
import { ContentSourceFormComponent } from './content-source-form/content-source-form.component';
import { PageHeaderComponent } from './page-header/page-header.component';

@NgModule({
  declarations: [
    AppComponent,
    ContentSourceListComponent,
    AddItemComponent,
    MessagesComponent,
    ContentSourceFormComponent,
    PageHeaderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule, 
    GridModule,
    ButtonsModule,
    PopupModule,
    WindowModule,
    DropDownsModule,
    NgbModule
  ],
  providers: [ContentSourceListService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }