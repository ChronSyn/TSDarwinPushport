import { IPushPortConstructorArgs } from "./interfaces";
export declare class PushportClient {
    private connectionManager;
    constructor({ pass, user, heartbeat, host, port, topics, reconnectOnError, onStompError, onConnect, onConnecting, onConnectError, }: IPushPortConstructorArgs);
}
