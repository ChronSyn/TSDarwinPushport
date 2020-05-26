import _StompClient from "stompit";
import zlib from "zlib";
import xml2json from "xml2json";
import { IPushPortConstructorArgs } from "./interfaces";
import uniqBy from "lodash/uniqBy";
import { EMessageSource, IPushPortSubscription } from "@Modules/CommonInterfaces";


export class PushportClient {
  private Client: _StompClient.Client;
  constructor (args: IPushPortConstructorArgs) {
    const {
      pass,
      user,
      heartbeat = "3000,3000",
      host = "darwin-dist-44ae45.nationalrail.co.uk",
      port = 61613,
      topics = []
    } = args;
    if (!pass || !user || !host || !port) {
      throw new Error(
        "You should ensure you provide all non-optional arguments when creating a new Network Rail Pushport instance"
      );
    }

    _StompClient.connect({
      host,
      port,
      connectHeaders: {
        host,
        "heart-beat": heartbeat,
        login: user,
        passcode: pass,
      }
    }, (err, client) => {
      if (err) {
        throw err;
      }
      this.Client = client;
      const subTopics: IPushPortSubscription[] = uniqBy(topics, ({topic}) => topic);
      subTopics.forEach(({topic, onMessage, onError}) => {
        this.Client.subscribe(
          { destination: topic, ack: "client-individual" },
          (err, message) => {
            if (err) {
              onError(err);
              return;
            }
            if (message){
              let buffer = [];
              message.pipe(zlib.createGunzip())
                .on("error", (err) => {throw err})
                .on("data", (chunk) => buffer = buffer.concat([...buffer, chunk]))
                .on("end", () => {
                  try {
                    const data = xml2json.toJson(buffer.toString(), {
                      coerce: true,
                      trim: true,
                      //@ts-ignore
                      object: true,
                      // alternateTextNode: "value"
                    })
                    onMessage({
                      source: EMessageSource.NATIONAL_RAIL,
                      channel: topic,
                      topic: topic.slice(7),
                      data: {
                        headers: null,
                        //@ts-ignore
                        body: data?.Pport?.uR ?? null
                      }
                    });
                  } catch(error) {
                    onError(err);
                  }
                })
            }
          }
        )
      });

    })
    
  }
}