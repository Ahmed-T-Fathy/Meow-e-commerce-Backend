import { Category } from 'src/categories/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal')
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToMany(()=>Category,(category)=>category.products)
  @JoinTable({
    name:"product_categories",
    joinColumn:{ name:'product_id',referencedColumnName:"id"},
    inverseJoinColumn:{name:'category_id',referencedColumnName:"id"},
  })
  categories:Category[];
}
