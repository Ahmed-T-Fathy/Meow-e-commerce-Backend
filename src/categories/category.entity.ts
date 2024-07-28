import { Product } from 'src/products/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
} from 'typeorm';
@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  @BeforeInsert()
  beforeInsert() {
    this.created_at = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updated_at = new Date();
  }
}
