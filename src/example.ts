require("dotenv").config();

import {
  INetworkRailTopic,
  INationalRailTopic,
  PushportClientNetworkRail,
  PushportClientNationalRail
} from "TSDarwinPushport";


const NationalRailTopics: INationalRailTopic[] = [
  {
    topic: "/topic/darwin.pushport-v16",
    onError: (err) => console.log({err}),
    onMessage: (message) => console.log(message.source, {message})
  }
]
const NationalRailSingleton = new PushportClientNationalRail({
  user: process.env.NATIONAL_RAIL_USER,
  pass: process.env.NATIONAL_RAIL_PASS,
  host: process.env.NATIONAL_RAIL_HOST,
  port: 61613,
  topics: NationalRailTopics
});


const NetworkRailTopics: INetworkRailTopic[] = [
  {
    topic: "/topic/TD_ALL_SIG_AREA",
    responseAsJson: true,
    onError: (err) => console.log({err}),
    onMessage: (message) => console.log(message.source, {message})
  },
  {
    topic: "/topic/RTPPM_ALL",
    responseAsJson: true,
    onError: (err) => console.log({err}),
    onMessage: (message) => console.log(message.source, {message})
  }
]
const NetworkRailSingleton = new PushportClientNetworkRail({
  user: process.env.NETWORK_RAIL_USER,
  pass: process.env.NETWORK_RAIL_PASS,
  host: "datafeeds.networkrail.co.uk",
  port: 61618,
  protocolVersion: "1.0",
  topics: NetworkRailTopics
});