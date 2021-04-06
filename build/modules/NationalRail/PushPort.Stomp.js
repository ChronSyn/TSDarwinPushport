"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushportClient = void 0;
const stompit_1 = __importDefault(require("stompit"));
const zlib_1 = __importDefault(require("zlib"));
const xml2json_1 = __importDefault(require("xml2json"));
const uniqBy_1 = __importDefault(require("lodash/uniqBy"));
const CommonInterfaces_1 = require("../CommonInterfaces");
class PushportClient {
    constructor({ pass, user, heartbeat = "3000,3000", host = "darwin-dist-44ae45.nationalrail.co.uk", port = 61613, topics = [], reconnectOnError = true, onStompError = (error) => { }, onConnect = (server) => { }, onConnecting = (server) => { }, onConnectError = (error) => { }, }) {
        if (!pass || !user || !host || !port) {
            throw new Error("You should ensure you provide all non-optional arguments when creating a new Network Rail Pushport instance");
        }
        this.connectionManager = new stompit_1.default.ConnectFailover([
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
        const channel = new stompit_1.default.Channel(this.connectionManager, {
            recoverAfterApplicationError: true,
        });
        const subTopics = uniqBy_1.default(topics, ({ topic }) => topic);
        subTopics.forEach(({ topic, onMessage, onError }) => {
            channel.subscribe({
                destination: topic,
                ack: "client-individual",
            }, (err, message, sub) => {
                if (err) {
                    onError(err);
                    return;
                }
                if (message) {
                    let buffer = [];
                    message
                        .pipe(zlib_1.default.createGunzip())
                        .on("error", (err) => {
                        console.log("Throws error at line 55");
                        throw err;
                    })
                        .on("data", (chunk) => (buffer = buffer.concat([...buffer, chunk])))
                        .on("end", () => {
                        var _a, _b;
                        try {
                            channel.ack(message);
                        }
                        catch (err) {
                            console.log("ACK ERROR!!!: ", err);
                        }
                        try {
                            const data = xml2json_1.default.toJson(buffer.toString(), {
                                coerce: true,
                                trim: true,
                                //@ts-ignore
                                object: true,
                                // alternateTextNode: "value"
                            });
                            onMessage({
                                source: CommonInterfaces_1.EMessageSource.NATIONAL_RAIL,
                                channel: topic,
                                topic: topic.slice(7),
                                data: {
                                    headers: null,
                                    //@ts-ignore
                                    body: (_b = (_a = data === null || data === void 0 ? void 0 : data.Pport) === null || _a === void 0 ? void 0 : _a.uR) !== null && _b !== void 0 ? _b : null,
                                },
                            });
                        }
                        catch (error) {
                            if (error) {
                                onError(err);
                            }
                        }
                    });
                }
            });
        });
    }
}
exports.PushportClient = PushportClient;
//# sourceMappingURL=PushPort.Stomp.js.map