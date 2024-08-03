import { Photo } from 'src/photos/photo.entity';
import { Product } from 'src/products/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';

@Entity()
export class Color {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  color: string;

  @Column()
  code: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Color, (color) => color.photos)
  photos: Photo[];

  @BeforeInsert()
  beforeInsert() {
    this.created_at = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updated_at = new Date();
  }
}
