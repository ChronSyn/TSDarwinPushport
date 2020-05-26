"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushportClientNationalRail = exports.PushportClientNetworkRail = void 0;
require("module-alias/register");
const PushPort_Stomp_1 = require("./modules/NationalRail/PushPort.Stomp");
Object.defineProperty(exports, "PushportClientNationalRail", { enumerable: true, get: function () { return PushPort_Stomp_1.PushportClient; } });
const Pushport_Stomp_1 = require("./modules/NetworkRail/Pushport.Stomp");
Object.defineProperty(exports, "PushportClientNetworkRail", { enumerable: true, get: function () { return Pushport_Stomp_1.PushportClient; } });
//# sourceMappingURL=index.js.map