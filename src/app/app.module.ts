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
import { InputsModule } from '@progress/kendo-angular-inputs';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ContentSourceListComponent } from './components/lists/content-source-list/content-source-list.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { ContentSourceListService } from './services/content-source-list.service';
import { MessagesComponent } from './components/messages/messages.component';
import { MessageService } from './services/message.service';
import { ContentSourceFormComponent } from './components/forms/content-source-form/content-source-form.component';
import { CrawlRuleFormComponent } from './components/forms/crawl-rule-form/crawl-rule-form.component';
import { CrawlRuleListComponent } from './components/lists/crawl-rule-list/crawl-rule-list.component';
import { CrawlRuleListService } from './services/crawl-rule-list.service';
import { GenerateXmlComponent } from './components/generate-xml/generate-xml.component';
import { SearchSchemaFormComponent } from './components/forms/search-schema-form/search-schema-form.component';
import { SearchSchemaListComponent } from './components/lists/search-schema-list/search-schema-list.component';
import { SearchSchemaListService } from './services/search-schema-list.service';
import { MappingFormComponent } from './components/forms/mapping-form/mapping-form.component';
import { ResultSourceListComponent } from './components/lists/result-source-list/result-source-list.component';
import { ResultSourceFormComponent } from './components/forms/result-source-form/result-source-form.component';
import { ResultSourceListService } from './services/result-source-list.service';

const appRoutes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full'},
  { path: 'index', component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ContentSourceListComponent,
    AddItemComponent,
    MessagesComponent,
    ContentSourceFormComponent,
    CrawlRuleFormComponent,
    CrawlRuleListComponent,
    GenerateXmlComponent,
    SearchSchemaFormComponent,
    SearchSchemaListComponent,
    MappingFormComponent,
    ResultSourceListComponent,
    ResultSourceFormComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule, 
    GridModule,
    ButtonsModule,
    PopupModule,
    WindowModule,
    DropDownsModule,
    InputsModule
  ],
  providers: [ContentSourceListService, MessageService, CrawlRuleListService, SearchSchemaListService, ResultSourceListService],
  bootstrap: [AppComponent]
})
export class AppModule { }