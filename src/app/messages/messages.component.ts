import { Component, OnInit } from '@angular/core';
import { MessageService } from '../service/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  public offset = { left: 5, top: 5 };

  constructor(public messageService: MessageService) { }

  ngOnInit() {
  }

}
