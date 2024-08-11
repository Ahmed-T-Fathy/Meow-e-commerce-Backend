import { Expose } from "class-transformer";

export class UserDTO{
    @Expose()
    username:string;

    @Expose()
    email:string;

    @Expose()
    phone:string;

    @Expose()
    role:string;

    @Expose()
    is_verified:boolean;
}