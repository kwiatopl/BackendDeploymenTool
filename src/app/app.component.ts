import { Component, OnInit, HostListener } from '@angular/core';
declare var jquery :any;
declare var $ :any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostListener('window:beforeunload', ['$event'])
  doSomething($event) {
    $event.returnValue='Your data will be lost!';
  }
  
  title = 'Backend Deployment Tool';

  OnInit () {
  }

  onClick(list:string, span:string) {
    if($("#" + span).hasClass('visible')) {
      $("#" + list).hide("fast");
      $("#" + span).removeClass('k-i-arrow-chevron-up');
      $("#" + span).addClass('k-i-arrow-chevron-down');
      $("#" + span).removeClass('visible');
    } else {
      $("#" + list).show("fast");
      $("#" + span).removeClass('k-i-arrow-chevron-down');
      $("#" + span).addClass('k-i-arrow-chevron-up');
      $("#" + span).addClass('visible');
    }
  }
}

