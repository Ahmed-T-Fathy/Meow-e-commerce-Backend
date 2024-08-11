import { OrderItem } from 'src/order-items/order-item.entity';
import { Users } from 'src/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: [
      'outstanding',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ],
  })
  status: string;

  @Column('decimal')
  total_price: number;

  @OneToMany(() => Order, (order) => order.order_items)
  order_items: OrderItem[];

  @ManyToOne(() => Users, (users) => users.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
