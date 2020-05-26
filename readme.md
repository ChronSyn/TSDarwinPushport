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

This is a simple example of subscribing to both National Rail and Network Rail data feeds (also available in `src/example.ts`)

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

In this example, both `RTPPM_ALL` and `TD_ALL_SIG_AREA` topics from Network Rail will have their output logged to console. National Rail only provides a single topic, (`/topic/darwin.pushport-v16`), and this includes all messages that your account is subscribed for.

For network rail, you can omit `responseAsJson` (or set the parameter to a non-truthy value) if you wish to have the string content returned instead. This option is not available for the National Rail subscriber. This is due to the usage of 2 different libraries to allow compatibility with both services.

You can subscribe to as many feeds/topics as you wish with one connection. Note that you must provide the full topic path, including the `/topic` prefix (if necessary).

## Data structure

Each message returned from the subscription will have the following properties:

  - source
  Either `NATIONAL_RAIL` or `NETWORK_RAIL`, depending upon which provider the data is from.

  - channel
  The full topic name, including the `/topic/` prefix

  - topic
  The topic name only, excluding the `/topic/` prefix

  - data
  The data sent by the message. This will includes a `headers` and `body` property. Note that only the Network Rail subscriber provide headers, while the National Rail provider simply returns null.

It is important that if trying to access `headers`, you check for null before trying to access more data further down the object tree.

## Notes

This library does not perform any parsing on the messages, other than converting them to JSON and extracting the main element from the message.

For Network Rail, the entire message body is returned. For National Rail, only data from the `data.Pport.uR` object is returned. If this path in the structure is undefined or unavailable, null will be returned.
