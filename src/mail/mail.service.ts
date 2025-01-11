import {
  Injectable,
  InternalServerErrorException,
  Logger,
  Response,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgun, { MailgunMessageData } from 'mailgun.js';
import FormData from 'form-data';
// import { MailerService } from '@nestjs-modules/mailer';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs/promises'; // Use promises for better async handling

//M@e@o@w@1431@
@Injectable()
export class MailService {
  private readonly logger = new Logger('MailService');
  private mailgun;
  private client;
  constructor(
    private readonly configService: ConfigService,
    // private readonly mailerService: MailerService,
  ) {
    this.mailgun = new Mailgun(FormData);
    this.client = this.mailgun.client({
      username: 'api',
      key: this.configService.get<string>('MAILGUN_API_KEY'),
    });
  }

  //   public async sendMail() {
  //     // const htmlContent = this.mailTemp.replace('<%=title%>', title).replace('<%=content%>', content);

  //     // const options: MailgunMessageData = {
  //     //   from: this.configService.get<string>('FROM_EMAIL'),
  //     //   to: ,
  //     //   subject: 'Test Mail',
  //     //   html: this.mailTemp,
  //     // };

  //     try {
  //       const email = this.mailerService.sendMail({
  //         to: 'Midos2290@yahoo.com',
  //         from: 'meowteamservices@gmail.com',
  //         subject: 'test mail',
  //         text: 'KOSMAK ya Shehataaaaaaaaaaaaaaaaaaaa',
  //       });
  //       this.logger.log(`Email successfully sent to: ahmed.tarek1244@gmail.com`);
  //       return email;
  //     } catch (error) {
  //       this.logger.warn(`Problem in sending email: ${error}`);
  //       throw error;
  //     }
  //   }

  public async sendMail(invoice: Invoice) {
    try {
      const filePath = path.join(
        __dirname,
        '../../src/mail/template/test-mail.temp.ejs',
      );

      // Read the EJS file
      const template = await fs.readFile(filePath, 'utf-8');
      const html = ejs.render(template, { invoice });

      const messageData = {
        from: 'meowteamservices@gmail.com',
        to: 'ahmed.tarek1244@gmail.com',
        subject: 'test',
        text: 'Hello form meow mail service',
        html,
      };
      const email = await this.client.messages.create(
        this.configService.get<string>('MAILGUN_DOMAIN'),
        messageData,
      );
      this.logger.log(`Email successfully sent to: ahmed.tarek1244@gmail.com`);
      return email;
    } catch (error) {
      console.log(error);

      this.logger.warn(`Problem in sending email: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }
  public async sendExclusiveCouponToUser(coupon: string, userMail: string) {
    try {
      const filePath = path.join(
        __dirname,
        '../../src/mail/template/send-exclusive-coupon.ejs',
      );
      // const filePath = './template/send-exclusive-coupon.ejs';
      const template = await fs.readFile(filePath, 'utf-8');
      const html = ejs.render(template, { coupon });

      const messageData = {
        from: 'test@sandbox8f405c4fb665452c9da8e2b31951fca4.mailgun.org',
        to: userMail,
        subject: 'كود خصم 20% !',
        text: 'عرض لك فقط ! ، كود خصم بنسبة 20%',
        html,
      };
      // console.log(messageData);

      const email = await this.client.messages.create(
        this.configService.get<string>('MAILGUN_DOMAIN'),
        messageData,
      );
      // console.log(email);

      // this.logger.log(`Email successfully sent to: ahmed.tarek1244@gmail.com`);
      return email;
    } catch (err) {
      // console.log(err);

      throw new InternalServerErrorException(err);
    }
  }
}
