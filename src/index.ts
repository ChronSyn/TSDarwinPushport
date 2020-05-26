import "module-alias/register";

import { PushportClient as PushportClientNationalRail } from "@ModulesNationalRail/PushPort.Stomp";
import { PushportClient as PushportClientNetworkRail } from "@Modules/NetworkRail/Pushport.Stomp";
import { IPushPortSubscription as INationalRailTopic } from "@Modules/CommonInterfaces";
import { INetworkRailTopic } from "@Modules/NetworkRail/interfaces";

export {
  INetworkRailTopic,
  INationalRailTopic,
  PushportClientNetworkRail,
  PushportClientNationalRail
};