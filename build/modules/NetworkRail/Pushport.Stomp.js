"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushportClient = void 0;
require("dotenv").config();
const stomp_client_1 = require("stomp-client");
const uniqBy_1 = __importDefault(require("lodash/uniqBy"));
class PushportClient {
    constructor(args) {
        this.subscribe = (topics) => {
            this.Client.connect(() => {
                const subTopics = uniqBy_1.default(topics, ({ topic }) => topic);
                console.log(subTopics);
                subTopics.forEach(({ topic, responseAsJson, callback }) => {
                    this.Client.subscribe(topic, (body, headers) => callback({
                        body: responseAsJson ? JSON.parse(body) : body,
                        headers: responseAsJson ? JSON.parse(JSON.stringify(headers)) : headers
                    }));
                });
            });
        };
        const { pass, user, host = "datafeeds.networkrail.co.uk", port = 61618, protocolVersion = "1.0" } = args;
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
    }
}
exports.PushportClient = PushportClient;
//# sourceMappingURL=Pushport.Stomp.js.map