import { Injectable } from '@nestjs/common';
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
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    // this.client = Twilio(
    //   this.configService.get<string>('TWILIO_ACCOUNT_SID'),
    //   this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    // );
    // this.verifyServiceSid = this.configService.get<string>(
    //   'TWILIO_VERIFICATION_SERVICE_SID',
    // );
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

  async sendOtpOurSMS(to: string, otpCode: string) {
    const token = this.configService.get<string>('SMS_API_TOKEN');
    const src = 'OurSms.Net';

    // Use a single number directly
    const payload = new URLSearchParams({
      token,
      src,
      dests: to, // Single phone numbe
      body: "message",
    }).toString();

    console.log('Sending payload:', payload); // Log the payload

    try {
      const response: AxiosResponse<any> = await lastValueFrom(
        this.httpService.post(this.apiUrl, payload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      if (response.status === 200) {
        return 'SMS sent successfully.';
      } else {
        return `Failed to send SMS. Error: ${response.data}`;
      }
    } catch (error) {
      console.error(
        'Error sending SMS:',
        error.response?.data || error.message,
      );
      throw new Error(
        `Failed to send SMS. Error: ${error.response?.data || error.message}`,
      );
    }
  }
}
