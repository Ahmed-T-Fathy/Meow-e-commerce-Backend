import { OrderItem } from 'src/order-items/order-item.entity';
import { Users } from 'src/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Orders_Status } from './order-status';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', default: Orders_Status.outstanding})
  status: string;

  @Column('decimal')
  total_price: number;

  @Column('decimal',{name:"before_discount"})
  beforeDiscount: number;

  @Column('decimal')
  discount: number;

  @Column('decimal')
  tax: number;

  @Column('decimal',{ name: 'delivery_service' })
  deliveryService: number;

  @Column({nullable:false})
  address:string;

  @Column({nullable:false,name:"postal_code"})
  postalCode:string;

  @Column({nullable:false})
  city:string;

  @Column({nullable:false})
  zone:string;

  @Column({nullable:false})
  location:string;

  @Column({nullable:false,name:"phone_number"})
  phoneNumber:string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  order_items: OrderItem[];

  @ManyToOne(() => Users, (users) => users.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeInsert()
  beforeInsert() {
    this.created_at = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updated_at = new Date();
  }
}
