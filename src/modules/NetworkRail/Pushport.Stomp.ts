import { StompClient as _StompClient } from "stomp-client";
import { IPushPortConstructorArgs, INetworkRailTopic } from "./interfaces";
import uniqBy from "lodash/uniqBy";
import { IPushPortSubscription, EMessageSource } from "@Modules/CommonInterfaces";

export class PushportClient {
  private Client: typeof _StompClient;
  constructor (args: IPushPortConstructorArgs) {
    const {
      pass,
      user,
      host = "datafeeds.networkrail.co.uk",
      port = 61618,
      protocolVersion = "1.0",
      topics = []
    } = args;
    if (!pass || !user || !host || !port || !protocolVersion) {
      throw new Error(
        "You should ensure you provide all non-optional arguments when creating a new Network Rail Pushport instance"
      );
    }
    this.Client  = new _StompClient({
      address: host,
      port,
      user,
      pass,
      protocolVersion
    });

    this.subscribe(topics);
  }

  private subscribe = (topics: IPushPortSubscription[]): void => {
    this.Client.connect(() => {
      const subTopics: INetworkRailTopic[] = uniqBy(topics, ({topic}) => topic);
      subTopics.forEach(({topic, responseAsJson, onError, onMessage}) => {
        try {
          this.Client.subscribe(
            topic,
            (body, headers) => onMessage({
              source: EMessageSource.NETWORK_RAIL,
              channel: topic,
              topic: topic.slice(7),
              data: {
                headers,
                body: responseAsJson ? JSON.parse(body) : body
              }
            })
          )
        } catch(error) {
          console.log("Called onError in networkRail at line 51")
          onError(error);
        }
      });
    });
  }
}