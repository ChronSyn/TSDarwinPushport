# [BETA] Railscope API Pushport

[BETA] A node.js library for receiving data from the National Rail and Network Rail live data feeds.

##### Related libraries

- TSOpenLDB: A typescript library for interacting with the UK National Rail OpenLDBSV (staff) web service

https://github.com/ChronSyn/TSOpenLDB

- TSDarwinPushport: A node.js library for receiving data from the National Rail and Network Rail live data feeds.

https://github.com/ChronSyn/TSDarwinPushport

- Railscope API: An API gateway for retrieving UK rail information

https://github.com/ChronSyn/railscope-api-community-edition

## Documentation

Network Rail Feeds Registration: https://datafeeds.networkrail.co.uk/ntrod/

National Rail Feeds Registration: https://opendata.nationalrail.co.uk/

Library documentation: https://chronsyn.github.io/TSDarwinPushport/

## Usage

Create a `.env` file (or add to an existing one) with these properties;

    NETWORK_RAIL_USER="<Username used to login to Network Rail>"
    NETWORK_RAIL_PASS="<Password used to login to Network Rail>"

    NATIONAL_RAIL_USER="<National Rail Feed Username>"
    NATIONAL_RAIL_PASS="<National Rail Feed Password>"
    NATIONAL_RAIL_HOST="<National Rail Feed Host>"

Then, see the example below.

This is a simple example of subscribing to National Rail data feeds (also available in `src/example.ts`) and logging messages to a file.

```typescript
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
```

In this example, we subscribe to National Rail feeds (via the `/topic/darwin.pushport-v16`), and when a message is received, we check if it is an `OW` message type (indicating a station message, commonly used to alert customers about delays or ongoing work at a station), and then write the message contents to a local file.

The use case for this would be to call `NationalRailSingletonInit()` when you wish to subscribe. At this time, this library doesn't support disconnecting - it is still in beta and a work in progress.

You can subscribe to as many feeds/topics as you wish with one connection. Note that you must provide the full topic path, including the `/topic` prefix (if necessary).

**As of version 1.0.2**
Additional optional callbacks have been added to the constructor:

- `onConnect`: Triggered when the connection to the feeds has succeeded
- `onStompError`: Triggered when an error occured with the STOMP client
- `onConnectError`: Triggered when there is an error connecting to the feeds
- `onConnecting`: Triggered when the STOMP client first attempts to connect.

## Data structure

Each message returned from the subscription will have the following properties:

- source
  Either `NATIONAL_RAIL` or `NETWORK_RAIL`, depending upon which provider the data is from.

- channel
  The full topic name, including the `/topic/` prefix

- topic
  The topic name only, excluding the `/topic/` prefix

- data
  The data sent by the message. This will includes a `headers` and `body` property. Note that only the Network Rail subscriber provide headers, while the National Rail provider simply returns null for headers.

It is important that if trying to access `headers`, you check for null before trying to access more data further down the object tree.

## Notes

This library does not perform any parsing on the messages, other than converting them to JSON and extracting the main element from the message.

For Network Rail, the entire message body is returned. For National Rail, only data from the `data.Pport.uR` object is returned. If this path in the structure is undefined or unavailable, null will be returned.

[Below added: April 2021]
Version 1.0.2 released. I'm aware that the code inside the library is extremely messy. I am aiming to improve this in the near future.
