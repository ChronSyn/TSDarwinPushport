interface IPushPortSubscriptionResponse {
  body: string;
  headers: string;
}

interface IPushPortSubscriptionResponseJson {
  body: {[key: string]: string};
  headers: {[key: string]: string};
}

export interface IPushPortSubscription {
  topic: string;
  responseAsJson?: boolean;
  callback: ({body, headers}: IPushPortSubscriptionResponse | IPushPortSubscriptionResponseJson) => void;
}

export interface IPushPortConstructorArgs {
  host?: string;
  port?: number;
  user: string;
  pass: string;
  protocolVersion?: string;
}