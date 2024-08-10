import { Color } from 'src/colors/color.entity';
import { Product } from 'src/products/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  BeforeRemove,
} from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  link: string;

  @Column({ default: false })
  is_main: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Product, (product) => product.photos, { onDelete: 'SET NULL' })
  product: Product;

  @ManyToOne(() => Color, (color) => color.photos, { onDelete: 'SET NULL' })
  color: Color;

  @BeforeInsert()
  beforeInsert() {
    this.created_at = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updated_at = new Date();
  }
  @BeforeRemove()
  async beforeRemove() {
    const filePath = path.resolve(
      path.join(__dirname, '..', '..', 'uploads', this.link),
    );

    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }
}
