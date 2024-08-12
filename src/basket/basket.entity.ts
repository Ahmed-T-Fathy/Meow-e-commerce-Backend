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

  @OneToMany(()=>Basket,(basket)=>basket.basket_items)
  basket_items:BasketItem[];

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
