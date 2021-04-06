import { IPushPortSubscription } from "../CommonInterfaces";
import _StompClient from "stompit";
export interface IPushPortConstructorArgs {
    host?: string;
    port?: number;
    heartbeat?: string;
    user: string;
    pass: string;
    topics: IPushPortSubscription[];
    reconnectOnError?: boolean;
    onStompError?: (error: _StompClient.ConnectFailover.ConnectError) => void;
    onConnect?: (server: _StompClient.ConnectFailover.ConnectState) => void;
    onConnecting?: (server: _StompClient.ConnectFailover.ConnectState) => void;
    onConnectError?: (error: Error) => void;
}
