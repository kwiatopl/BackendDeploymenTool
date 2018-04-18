import { IItem } from "./item";
import { ResultSourceType } from "./enums/rsTypeEnum";

export class ResultSource implements IItem {
    Id: number;
    Name: string;
    Ssa: string;
    Type: ResultSourceType
    RemoteUrl: string;
    Description: string;
    QueryTransform: string;
}