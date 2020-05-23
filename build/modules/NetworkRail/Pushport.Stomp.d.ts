import { IPushPortSubscription, IPushPortConstructorArgs } from "./interfaces";
export declare class PushportClient {
    private Client;
    constructor(args: IPushPortConstructorArgs);
    subscribe: (topics: IPushPortSubscription[]) => void;
}
