import { Component, OnInit } from '@angular/core';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { ContentSourceListService } from '../../services/content-source-list.service';
import { CrawlRuleListService } from '../../services/crawl-rule-list.service';
import { ContentSource } from '../../models/contentSource';
import { CrawlRule } from '../../models/crawlRule';
import { SearchSchemaListService } from '../../services/search-schema-list.service';
import { ResultSourceListService } from '../../services/result-source-list.service';
import { saveAs } from 'file-saver/FileSaver';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Component({
  selector: 'app-generate-xml',
  templateUrl: './generate-xml.component.html',
  styleUrls: ['./generate-xml.component.scss']
})
export class GenerateXmlComponent implements OnInit {
  ItemsList: any[] = new Array();

  verifyData() {
    var regex = /<[a-zA-Z\/][^>]*>/ig;
    //var regex = /(<([^>]+)>)|([<>!])/ig;
    this.ItemsList.forEach( el => {
      el.forEach( innerEl => {
        Object.keys(innerEl).forEach( key => {
          if(innerEl[key] && key !== 'Id' && (typeof innerEl[key]  === 'string' || innerEl[key] instanceof String))
          {
            innerEl[key] = innerEl[key].replace(regex,'');
          }
        }) 
      })
    });
  }

  gatherData() {
    this.ItemsList.length = 0;
    this.ItemsList.push(this.csStore.getItems());
    this.ItemsList.push(this.crStore.getItems());
    this.ItemsList.push(this.ssStore.getItems());
    this.ItemsList.push(this.rsStore.getItems());
  }

  onClick() { 
    this.gatherData();
    this.verifyData();
    return this.http.post("/api/generatexml", JSON.stringify(this.ItemsList), {responseType: "blob", headers: new HttpHeaders({ 'Content-Type':  'application/json' })})
    .subscribe(
      data => { 
        console.log("Post request succesful", data);
        let filename = "DeployScript.zip";
        saveAs(data, filename);
      }, 
      error => { 
        console.log("Error", error ) 
      });
  }

  constructor(private http:HttpClient, private csStore:ContentSourceListService, private crStore:CrawlRuleListService, private ssStore:SearchSchemaListService, private rsStore:ResultSourceListService) { }

  ngOnInit() {
  }
}
