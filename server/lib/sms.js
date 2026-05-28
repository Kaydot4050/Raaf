import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client =
  accountSid && authToken && fromNumber ? twilio(accountSid, authToken) : null;

export async function sendOtpSms(phone, code) {
  const body = `Your Raafortagro verification code is ${code}. Valid for 10 minutes.`;

  if (client) {
    await client.messages.create({ to: phone, from: fromNumber, body });
    return { channel: 'sms' };
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEV OTP] ${phone} → ${code}`);
    return { channel: 'dev', code };
  }

  throw new Error('SMS is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.');
}
