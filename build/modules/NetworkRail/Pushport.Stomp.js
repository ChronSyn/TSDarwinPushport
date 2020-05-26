"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushportClient = void 0;
const stomp_client_1 = require("stomp-client");
const uniqBy_1 = __importDefault(require("lodash/uniqBy"));
const CommonInterfaces_1 = require("../CommonInterfaces");
class PushportClient {
    constructor(args) {
        this.subscribe = (topics) => {
            this.Client.connect(() => {
                const subTopics = uniqBy_1.default(topics, ({ topic }) => topic);
                subTopics.forEach(({ topic, responseAsJson, onError, onMessage }) => {
                    try {
                        this.Client.subscribe(topic, (body, headers) => onMessage({
                            source: CommonInterfaces_1.EMessageSource.NETWORK_RAIL,
                            channel: topic,
                            topic: topic.slice(7),
                            data: {
                                headers,
                                body: responseAsJson ? JSON.parse(body) : body
                            }
                        }));
                    }
                    catch (error) {
                        onError(error);
                    }
                });
            });
        };
        const { pass, user, host = "datafeeds.networkrail.co.uk", port = 61618, protocolVersion = "1.0", topics = [] } = args;
        if (!pass || !user || !host || !port || !protocolVersion) {
            throw new Error("You should ensure you provide all non-optional arguments when creating a new Network Rail Pushport instance");
        }
        this.Client = new stomp_client_1.StompClient({
            address: host,
            port,
            user,
            pass,
            protocolVersion
        });
        this.subscribe(topics);
    }
}
exports.PushportClient = PushportClient;
//# sourceMappingURL=Pushport.Stomp.js.map