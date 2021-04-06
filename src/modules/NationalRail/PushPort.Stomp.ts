import _StompClient from "stompit";
import zlib from "zlib";
import xml2json from "xml2json";
import { IPushPortConstructorArgs } from "./interfaces";
import uniqBy from "lodash/uniqBy";
import {
  EMessageSource,
  IPushPortSubscription,
} from "@Modules/CommonInterfaces";

export class PushportClient {
  private connectionManager: _StompClient.ConnectFailover;
  constructor({
    pass,
    user,
    heartbeat = "3000,3000",
    host = "darwin-dist-44ae45.nationalrail.co.uk",
    port = 61613,
    topics = [],
    reconnectOnError = true,
    onStompError = (error) => {},
    onConnect = (server) => {},
    onConnecting = (server) => {},
    onConnectError = (error) => {},
  }: IPushPortConstructorArgs) {
    if (!pass || !user || !host || !port) {
      throw new Error(
        "You should ensure you provide all non-optional arguments when creating a new Network Rail Pushport instance"
      );
    }

    this.connectionManager = new _StompClient.ConnectFailover([
      {
        host,
        port,
        connectHeaders: {
          host,
          "heart-beat": heartbeat,
          login: user,
          passcode: pass,
        },
      },
    ]);
    this.connectionManager.on("error", (err) => {
      if (reconnectOnError) {
        this.connectionManager.connect((error) => {
          onConnectError(error);
        });
      }
      onStompError(err);
    });
    this.connectionManager.on("connect", (server) => {
      onConnect(server);
    });
    this.connectionManager.on("connecting", (server) => {
      onConnecting(server);
    });

    const channel = new _StompClient.Channel(this.connectionManager, {
      recoverAfterApplicationError: true,
    });
    const subTopics: IPushPortSubscription[] = uniqBy(
      topics,
      ({ topic }) => topic
    );

    subTopics.forEach(({ topic, onMessage, onError }) => {
      channel.subscribe(
        {
          destination: topic,
          ack: "client-individual",
        },
        (err, message, sub) => {
          if (err) {
            onError(err);
            return;
          }
          if (message) {
            let buffer = [];
            message
              .pipe(zlib.createGunzip())
              .on("error", (err) => {
                console.log("Throws error at line 55");
                throw err;
              })
              .on(
                "data",
                (chunk) => (buffer = buffer.concat([...buffer, chunk]))
              )
              .on("end", () => {
                try {
                  channel.ack(message);
                } catch (err) {
                  console.log("ACK ERROR!!!: ", err);
                }
                try {
                  const data = xml2json.toJson(buffer.toString(), {
                    coerce: true,
                    trim: true,
                    //@ts-ignore
                    object: true,
                    // alternateTextNode: "value"
                  });
                  onMessage({
                    source: EMessageSource.NATIONAL_RAIL,
                    channel: topic,
                    topic: topic.slice(7),
                    data: {
                      headers: null,
                      //@ts-ignore
                      body: data?.Pport?.uR ?? null,
                    },
                  });
                } catch (error) {
                  if (error) {
                    onError(err);
                  }
                }
              });
          }
        }
      );
    });
  }
}
