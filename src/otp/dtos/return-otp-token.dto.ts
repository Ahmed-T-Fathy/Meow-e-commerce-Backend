import { Expose } from "class-transformer";

export class ReturnOTPTokenDTO{
    @Expose()
    token: string;
}