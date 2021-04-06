require("dotenv").config();

import logger from "@Modules/Logging/logging.module";
import {
  INationalRailTopic,
  PushportClientNationalRail,
} from "TSDarwinPushport";
import fs from "fs";

const handlePushPostMessage = (message) => {
  if (message.data.body.OW) {
    const filename = `${__dirname}\\${new Date().getTime().toString()}.json`;
    logger.log("debug", `Got a delay message! Logged to: ${filename}`);
    fs.writeFileSync(filename, JSON.stringify(message, null, 2));
  }
};

const NationalRailTopics: INationalRailTopic[] = [
  {
    topic: "/topic/darwin.pushport-v16",
    onError: (err) => {
      if (err) {
        logger.log("error", `An error occured with /topic/darwin.pushport-v16`);
      }
    },
    onMessage: (message) => handlePushPostMessage(message),
  },
];
export const NationalRailSingletonInit = () =>
  new PushportClientNationalRail({
    user: process.env.DARWIN_PUSHPORT_LOGIN,
    pass: process.env.DARWIN_PUSHPORT_PASSWORD,
    host: process.env.DARWIN_PUSHPORT_HOST,
    port: 61613,
    topics: NationalRailTopics,
    onConnect: (server) => {
      logger.log("debug", "Connected to National Rail STOMP");
    },
    onStompError: (error) => {
      logger.log("error", `An error occured with STOMP: ${error.message}`);
    },
    onConnectError: (error) => {
      logger.log(
        "debug",
        `An error occured while connecting to STOMP: ${error.message}`
      );
    },
    onConnecting: (server) => {
      logger.log("debug", "Attempting to connect to National Rail STOMP...");
    },
    reconnectOnError: true,
  });
