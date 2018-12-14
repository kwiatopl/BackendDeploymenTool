import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient} from '@angular/common/http';
import { ContentSourceListService } from '../../services/content-source-list.service';
import { CrawlRuleListService } from '../../services/crawl-rule-list.service';
import { SearchSchemaListService } from '../../services/search-schema-list.service';
import { ResultSourceListService } from '../../services/result-source-list.service';
import { saveAs } from 'file-saver/FileSaver';
import * as moment from 'moment';

@Component({
  selector: 'app-generate-xml',
  templateUrl: './generate-xml.component.html',
  styleUrls: ['./generate-xml.component.scss']
})
export class GenerateXmlComponent implements OnInit {
  ItemsList: any[] = new Array();

  verifyData() {
    var regex = /<[a-zA-Z\/][^>]*>/ig;
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

    return this.http.post("/BDT/api/generatexml", JSON.stringify(this.ItemsList), {responseType: "blob", headers: new HttpHeaders({ 'Content-Type':  'application/json' })})
    .subscribe(
      data => { 
        console.log("Post request succesful", data);
        let date = moment().format("YYYY-MM-DD_HH-mm-ss-SSS");
        let filename = "DeployScript_ " + date + ".xml";
        saveAs(data, filename);
      }, 
      error => { 
        console.log("Error", error );
      });

  }

  constructor(private http:HttpClient, private csStore:ContentSourceListService, private crStore:CrawlRuleListService, private ssStore:SearchSchemaListService, private rsStore:ResultSourceListService) { }

  ngOnInit() {
  }
}
