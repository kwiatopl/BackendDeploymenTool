import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GridModule } from '@progress/kendo-angular-grid';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsModule} from '@progress/kendo-angular-buttons';
import { PopupModule } from '@progress/kendo-angular-popup';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputsModule } from '@progress/kendo-angular-inputs';

import { AppComponent } from './app.component';
import { ContentSourceListComponent } from './content-source-list/content-source-list.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ContentSourceListService } from './service/content-source-list.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './service/message.service';
import { ContentSourceFormComponent } from './content-source-form/content-source-form.component';
import { CrawlRuleFormComponent } from './crawl-rule-form/crawl-rule-form.component';
import { CrawlRuleListComponent } from './crawl-rule-list/crawl-rule-list.component';
import { CrawlRuleListService } from './service/crawl-rule-list.service';
import { GenerateXmlComponent } from './generate-xml/generate-xml.component';

@NgModule({
  declarations: [
    AppComponent,
    ContentSourceListComponent,
    AddItemComponent,
    MessagesComponent,
    ContentSourceFormComponent,
    CrawlRuleFormComponent,
    CrawlRuleListComponent,
    GenerateXmlComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule, 
    GridModule,
    ButtonsModule,
    PopupModule,
    WindowModule,
    DropDownsModule,
    NgbModule,
    InputsModule
  ],
  providers: [ContentSourceListService, MessageService, CrawlRuleListService],
  bootstrap: [AppComponent]
})
export class AppModule { }