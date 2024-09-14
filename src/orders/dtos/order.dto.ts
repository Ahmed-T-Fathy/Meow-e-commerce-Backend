import { Expose, Type } from "class-transformer";
import { OrderItemDTO } from "src/order-items/dtos/order-item.dto";
import { OrderItem } from "src/order-items/order-item.entity";
import { UserDTO } from "src/users/dtos/user.dto";

export class OrderDTO{
    @Expose()
    id:string;

    @Expose()
    status:string;

    @Expose()
    address:string;

    @Expose()
    @Type(()=>UserDTO)
    user:UserDTO;

    @Expose()
    total_price:string;

    @Expose()
    @Type(()=>OrderItemDTO)
    order_items:OrderItemDTO[];
}