import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  //   private readonly client: Twilio.Twilio;
  //   private readonly verifyServiceSid: string;
  private readonly apiUrl; // Replace with actual URL
  private readonly apiKey; // Replace with your API key

  private twilioClient: Twilio.Twilio;
  private senderNumber: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.senderNumber = this.configService.get<string>('TWILIO_SENDER_NUMBER');

    this.twilioClient = new Twilio.Twilio(accountSid, authToken);

    this.apiKey = this.configService.get<string>('SMS_API_KEY');
    this.apiUrl = this.configService.get<string>('SMS_API_URL');
  }

  //   async sendOtpTwilio(to: string, otpCode: string): Promise<void> {
  //     const message = `Your OTP code is ${otpCode}. It is valid for 10 minutes.`;

  //     await this.client.messages.create({
  //       body: message,
  //       from: this.configService.get<string>('TWILIO_SENDER_PHONE_NUMBER'),
  //       to,
  //     });
  //   }

  // async sendOtpOurSMS(to: string, otpCode: number) {
  //   const token = this.configService.get<string>('SMS_API_TOKEN');
  //   const src = 'OurSms.Net';

  //   // Use a single number directly
  //   const payload = new URLSearchParams({
  //     token,
  //     src,
  //     dests: to, // Single phone numbe
  //     body: 'message',
  //   }).toString();

  //   console.log('Sending payload:', payload); // Log the payload

  //   try {
  //     const response: AxiosResponse<any> = await lastValueFrom(
  //       this.httpService.post(this.apiUrl, payload, {
  //         headers: {
  //           'Content-Type': 'application/x-www-form-urlencoded',
  //         },
  //       }),
  //     );

  //     if (response.status === 200) {
  //       return 'SMS sent successfully.';
  //     } else {
  //       return `Failed to send SMS. Error: ${response.data}`;
  //     }
  //   } catch (error) {
  //     console.error(
  //       'Error sending SMS:',
  //       error.response?.data || error.message,
  //     );
  //     throw new Error(
  //       `Failed to send SMS. Error: ${error.response?.data || error.message}`,
  //     );
  //   }
  // }

  async sendOtpOurSMS(to: string, otpCode: number) {
    try {
      let res = await this.twilioClient.messages.create({
        from: this.senderNumber,
        to,
        body: `otp: ${otpCode}`,
        messagingServiceSid:
          this.configService.get<string>('TWILIO_SMS_MSG_SID'),
      });

  console.log(res);
  
    } catch (err) {
      throw new InternalServerErrorException(
        err
      );
    }
  }
}
