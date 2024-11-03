import { Expose, Type } from "class-transformer";
import { OrderItemDTO } from "src/order-items/dtos/order-item.dto";
import { OrderItem } from "src/order-items/order-item.entity";
import { UserDTO } from "src/users/dtos/user.dto";

export class OrderDTO{
    @Expose()
    id:string;
    
    @Expose()
    orderNo:string;

    @Expose()
    status:string;
    
    @Expose()
    total_price:string;

    @Expose()
    beforeDiscount:number;

    @Expose()
    discount:number;

    @Expose()
    tax:number;

    @Expose()
    deliveryService:number;

    @Expose()
    address:string;

    @Expose()
    postalCode:string;

    @Expose()
    city:string;

    @Expose()
    zone:string;

    @Expose()
    location:string;

    @Expose()
    phoneNumber:string;

    @Expose()
    @Type(()=>UserDTO)
    user:UserDTO;

    @Expose()
    @Type(()=>OrderItemDTO)
    order_items:OrderItemDTO[];
}