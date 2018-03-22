import { Type } from './typeEnum';
import { Behavior } from './behaviorEnum';
import { Priority } from './priorityEnum';
import { Proxy } from './proxyEnum';
import { IItem } from './item';

export class ContentSource implements IItem {
    Id: number;
    Name: string;
    Ssa: string;
    Type: Type;
    Address: string;
    Continuous: boolean;
    CrawlPriority: Priority;
    Behavior: Behavior;
    SiteEnumeration: number;
    PageEnumeration: number;
    ProxyGroup: Proxy;
    LOBSystem: [string, string];
}