import { Injectable } from '@angular/core';
import { IItem } from '../models/item';

@Injectable()
export abstract class ListService {
  abstract getItems(): IItem[];
  abstract addItem(item: IItem): void;
  abstract removeItem(item: IItem): void;
  abstract resetItem(item: IItem): void;
  abstract editItem(item: IItem): void;

  constructor() { }
}
