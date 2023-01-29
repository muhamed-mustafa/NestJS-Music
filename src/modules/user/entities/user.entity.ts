import { Role } from 'src/common/enums/role.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToOne,
  JoinColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { Playlist } from 'src/modules/playlist/entities/playlist.entity';
import { UserJoinedRoom } from '../../../shared/modules/chat/entities/user-joined-room.entity';
import { Message } from '../../../shared/modules/chat/entities/message.entity';

@Entity('users')
@Unique(['email', 'username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, array: false, default: Role.USER })
  role: Role;

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @Column()
  profileId: number;

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];

  @Column({
    default: false,
  })
  isVerified: boolean;

  @Column({
    nullable: true,
  })
  googleId: string;

  @Column({
    nullable: true,
  })
  facebookId: string;

  @OneToMany(() => UserJoinedRoom, (userJoinedRoom) => userJoinedRoom.user, {
    eager: true,
  })
  userJoinedRooms: UserJoinedRoom[];

  @OneToMany(() => Message, (message) => message.user, {
    eager: true,
  })
  messages: Message[];

  @Column({ nullable: true })
  clientId: string;
}
