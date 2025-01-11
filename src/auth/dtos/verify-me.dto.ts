import { IsNotEmpty, IsString } from "class-validator";

export class VerifyMeDTO{
    @IsNotEmpty()
    @IsString()
    token: string;
}