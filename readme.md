# Railscope API Pushport

A node.js library for receiving data from the National Rail and Network Rail live data feeds.

This library is currently in ALPHA status! It should not be used at this time.

## Usage

This is a simple example of subscribing to Network Rail data feeds;

    import {
      IPushPortSubscriptionNetworkRail,
      PushportClientNetworkRail
    } from "TSDarwinPushport";

    // Create your array of topics
    const NetworkRailTopics: IPushPortSubscriptionNetworkRail[] = [
      {
        topic: "/topic/RTPPM_ALL",
        responseAsJson: true,
        callback: ({ body, headers }): void => console.log({body, headers})
      },
      {
        topic: "/topic/TD_ALL_SIG_AREA",
        responseAsJson: true,
        callback: ({ body, headers }): void => console.log({body, headers})
      }
    ]

    // Create the instance
    // You can also pass `host`, `port`, and `protocolVersion` if needed, but default are provided
    const NetworkRailSingleton = new NetworkRailPushportClient({
      user: "< username used to login to https://datafeeds.networkrail.co.uk/ntrod >",
      pass: "< password used to login to https://datafeeds.networkrail.co.uk/ntrod >"
    });

    // Connect and subscribe
    NetworkRailSingleton.subscribe(NetworkRailTopics);

In this example, both `RTPPM_ALL` and `TD_ALL_SIG_AREA` topics will have their output logged to console, both headers and body. You can omit `responseAsJson` (or set the parameter to a non-truthy value) if you wish to have the string content returned instead.

You can subscribe to as many feeds/topics as you wish with one connection. Note that you must provide the full topic path, including the `/topic` prefix (if necessary).