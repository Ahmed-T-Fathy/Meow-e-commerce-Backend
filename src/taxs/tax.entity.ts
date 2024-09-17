import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tax{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({unique:true})
    title:string;

    @Column('decimal')
    value:number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' , update: true})
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