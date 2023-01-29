import {
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Entity,
  Column,
} from 'typeorm';
import { Room } from './room.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity('users-joined-rooms')
export class UserJoinedRoom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: new Date() })
  joinedIn: Date;

  @Column()
  joinedUsername: string;

  @ManyToOne(() => Room, (room) => room.userJoinedRooms, {
    eager: false,
  })
  room: Room;

  @ManyToOne(() => User, (user) => user.userJoinedRooms, { eager: false })
  user: User;

  @Column()
  userId: number;

  @Column()
  roomId: number;
}
