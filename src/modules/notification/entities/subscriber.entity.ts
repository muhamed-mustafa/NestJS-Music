import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Key } from '../classes/keys';
import { SubscribersNotifications } from './subscribers-notifications.entity';

@Entity('subscribers')
export class Subscriber extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  endpoint: string;

  @Column({ nullable: true })
  expirationTime: Date;

  @Column('simple-json')
  keys: Key;

  @OneToOne(() => User, (user) => user.subscriber, {
    eager: false,
  })
  user: User;

  @OneToMany(
    () => SubscribersNotifications,
    (subscribersNotifications) => subscribersNotifications.subscriber,
    {
      eager: true,
    },
  )
  subscribersNotifications: SubscribersNotifications[];
}
