import { ContentSourceType } from './enums/csTypeEnum';
import { Behavior } from './enums/behaviorEnum';
import { Priority } from './enums/priorityEnum';
import { Proxy } from './enums/proxyEnum';
import { IItem } from './item';

export class ContentSource implements IItem {
    Id: number;
    Name: string;
    Ssa: string;
    Type: ContentSourceType;
    Address: string;
    Continuous: boolean;
    Priority: Priority;
    Behavior: Behavior;
    SiteEnumeration: number;
    PageEnumeration: number;
    ProxyGroup: Proxy;
    Proxy: string;
    LOBSystem: string;
}