import { IItem } from './item';
import { ManagedPropertyType } from './enums/mpTypeEnum';
import { Refinable } from './enums/refinableEnum';
import { Sortable } from './enums/sortableEnum';
import { Category } from './enums/categoryEnum';
import { Mapping } from './mapping';

export class ManagedProperty implements IItem {
    Id: number;
    Name: string;
    Ssa: string;
    Description: string;
    Type: ManagedPropertyType;
    Searchable: boolean;
    Queryable: boolean;
    Retrievable: boolean;
    MultiValue: boolean;
    Refinable: Refinable;
    Sortable: Sortable;
    Safe: boolean;
    Token: boolean;
    Complete: boolean;
    Order: boolean;
    Mapping: Array<Mapping> = new Array<Mapping>();
}