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
import { Auth } from '../../../common/classes/auth';
import * as bcrypt from 'bcryptjs';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { Playlist } from 'src/modules/playlist/playlist.entity';

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

  @Column()
  salt: string;

  @Column({ type: 'enum', enum: Role, array: true })
  roles: Role[];

  @Column('simple-json')
  auth: Auth;

  @OneToOne((type) => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @Column()
  profileId: number;

  @OneToMany((type) => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];

  async validatePassword(candidatePassword: string): Promise<boolean> {
    const hashPassword = await bcrypt.hash(candidatePassword, this.salt);
    return hashPassword === this.password;
  }
}
