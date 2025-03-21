import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const fromNumber = process.env.TWILIO_FROM_NUMBER || '';

const client = twilio(accountSid, authToken);

export const sendSms = (to: string, message: string) => {
    return client.messages.create({
        body: message,
        from: fromNumber,
        to: to,
    });
};