import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Role } from './roles.enum';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Order } from 'src/orders/order.entity';
import { Basket } from 'src/basket/basket.entity';
import { Exclude } from 'class-transformer';
// const scrypt = promisify(_scrypt);

@Entity()
@Unique('phone_mail_unique_constraint', ['email', 'phone'])
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'text', default: Role.User })
  role: Role;

  @OneToOne(() => Basket, (basket) => basket.user)
  basket: Basket;

  @OneToMany(() => Users, (users) => users.orders)
  orders: Order[];

  // @Column({ select: false,nullable:true })
  // @Exclude()
  // password_updated: boolean = false;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    // const salt: string = await randomBytes(8).toString('hex');
    // const hash: Buffer = (await scrypt(this.password, salt, 32)) as Buffer;
    // const result: string = salt + '.' + hash.toString('hex');
    this.password = await bcrypt.hash(this.password, 10);
    this.created_at = new Date();
  }

  @BeforeUpdate()
  async hashPasswordBeforUpdate() {
    // if (this.password_updated) {
    //   // const salt: string = await randomBytes(8).toString('hex');
    //   // const hash: Buffer = (await scrypt(this.password, salt, 32)) as Buffer;
    //   // const result: string = salt + '.' + hash.toString('hex');
    //   this.password = await bcrypt.hash(this.password, 10);
    //   this.password_updated = false;
    // }
    this.updated_at = new Date();
  }
  // @AfterLoad()
  // resetPasswordUpdated() {
  //   this.password_updated = false; // Reset to default after loading the entity
  // }
  async comparePassword(password): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  async generateToken(): Promise<string> {
    const payload = { id: this.id };
    const secret = process.env.JWT_SECRET;
    return await jwt.sign(payload, secret, { expiresIn: '1h' });
  }
}
