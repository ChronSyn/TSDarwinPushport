require("dotenv").config();
import { StompClient as _StompClient } from "stomp-client";
import { IPushPortSubscription, IPushPortConstructorArgs } from "./interfaces";
import uniqBy from "lodash/uniqBy";

export class PushportClient {
  private Client: typeof _StompClient;
  constructor (args: IPushPortConstructorArgs) {
    const {
      pass,
      user,
      host = "datafeeds.networkrail.co.uk",
      port = 61618,
      protocolVersion = "1.0"
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
  }

  public subscribe = (topics: IPushPortSubscription[]): void => {
    this.Client.connect(() => {
      const subTopics = uniqBy(topics, ({topic}) => topic);
      console.log(subTopics);
      subTopics.forEach(({topic, responseAsJson, callback}) => {
        this.Client.subscribe(
          topic,
          (body, headers) => callback({
            body: responseAsJson ? JSON.parse(body) : body,
            headers: responseAsJson ? JSON.parse(JSON.stringify(headers)) : headers
          })
        )
      });
    });
  }
}