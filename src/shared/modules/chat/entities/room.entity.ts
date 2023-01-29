import { UserJoinedRoom } from './user-joined-room.entity';
import { Message } from './message.entity';
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  Entity,
  Column,
} from 'typeorm';

@Entity('rooms')
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column()
  createdBy: string;

  @OneToMany(() => UserJoinedRoom, (userJoinedRoom) => userJoinedRoom.room, {
    eager: true,
  })
  userJoinedRooms: UserJoinedRoom[];

  @OneToMany(() => Message, (message) => message.room, {
    eager: true,
  })
  messages: Message[];
}
