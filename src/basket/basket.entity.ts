import { BasketItem } from 'src/basket-items/basket-item.entity';
import { Users } from 'src/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['user'])
export class Basket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Users, (user) => user.basket)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToMany(()=>BasketItem,(basketItem)=>basketItem.basket)
  basket_items:BasketItem[];

  @Column({default:false})
  reminder_sent:boolean;

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
