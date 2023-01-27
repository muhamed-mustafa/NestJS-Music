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
}
