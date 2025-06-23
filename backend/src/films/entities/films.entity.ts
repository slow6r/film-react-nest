import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';
import { Order } from '../../order/entities/order.entity';

@Entity({ name: 'films' })
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  rating: number;

  @Column()
  director: string;

  @Column('text')
  tags: string;

  @Column()
  title: string;

  @Column('text')
  about: string;

  @Column('text')
  description: string;

  @Column()
  image: string;

  @Column()
  cover: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.film, {
    cascade: true,
  })
  schedules: ScheduleEntity[];

  @OneToMany(() => Order, (order) => order.film, { cascade: true })
  orders: Order[];
}
