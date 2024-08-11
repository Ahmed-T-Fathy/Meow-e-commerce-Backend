import { Expose, Type } from "class-transformer";
import { UserDTO } from "src/users/dtos/user.dto";

export class OrderDTO{
    @Expose()
    id:string;

    @Expose()
    status:string;

    @Expose()
    @Type(()=>UserDTO)
    user:UserDTO;
}