import {
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Entity,
  Column,
} from 'typeorm';
import { Room } from './room.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity('messages')
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ default: new Date() })
  created: Date;

  @Column()
  roomName: string;

  @Column()
  sender: string;

  @ManyToOne(() => Room, (room) => room.messages, { eager: false })
  room: Room;

  @ManyToOne(() => User, (user) => user.messages, {
    eager: false,
  })
  user: User;

  @Column()
  roomId: number;

  @Column()
  userId: number;
}
