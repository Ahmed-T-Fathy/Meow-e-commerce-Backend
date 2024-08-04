import { Expose } from "class-transformer";

export class ColorDTO{
    @Expose()
    color:string;

    @Expose()
    code:string;
}