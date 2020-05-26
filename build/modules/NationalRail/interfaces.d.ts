import { IPushPortSubscription } from "@Modules/CommonInterfaces";
export interface IPushPortConstructorArgs {
    host?: string;
    port?: number;
    heartbeat?: string;
    user: string;
    pass: string;
    topics: IPushPortSubscription[];
}
