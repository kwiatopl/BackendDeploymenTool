import { IItem } from './item';
import { Rule } from './enums/ruleEnum';

export class CrawlRule implements IItem {
    Id: number;
    Name: string;
    Ssa: string;
    Regex: boolean;
    Rule: Rule;
    ExcludeComplexUrls: boolean;
    CrawlComplexUrls: boolean;
    FollowLinks: boolean;
    CrawlAsHttp: boolean;
    AccessMethod: string;
    Priority: number;
}