import { IPushPortSubscription } from "../CommonInterfaces";
export interface INetworkRailTopic extends IPushPortSubscription {
    responseAsJson?: boolean;
}
export interface IPushPortConstructorArgs {
    host?: string;
    port?: number;
    user: string;
    pass: string;
    protocolVersion?: string;
    topics: INetworkRailTopic[];
}
