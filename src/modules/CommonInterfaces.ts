
export enum EMessageSource {
  NATIONAL_RAIL = "NATIONAL_RAIL",
  NETWORK_RAIL = "NETWORK_RAIL"
}

export interface IOnMessageStructure {
  source: EMessageSource;
  channel: string;
  topic: string;
  data: {
    headers: {
      [key: string]: string;
    }
    body: {
      [key: string]: string;
    }
  }
}

export interface IPushPortSubscription {
  topic: string;
  onError: (err: Error) => void;
  onMessage: (data: IOnMessageStructure) => void;
}