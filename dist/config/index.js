"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database"));
// import {sendSms} from './sms';
exports.default = {
    mysqlCursor: database_1.default.mysqlCursor,
    memcache: database_1.default.memcache,
};
//# sourceMappingURL=index.js.map