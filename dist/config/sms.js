"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = void 0;
const twilio_1 = __importDefault(require("twilio"));
const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const fromNumber = process.env.TWILIO_FROM_NUMBER || '';
const client = (0, twilio_1.default)(accountSid, authToken);
const sendSms = (to, message) => {
    return client.messages.create({
        body: message,
        from: fromNumber,
        to: to,
    });
};
exports.sendSms = sendSms;
//# sourceMappingURL=sms.js.map