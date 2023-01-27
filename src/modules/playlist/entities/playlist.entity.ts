import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Track } from '../../track/entities/track.entity';

@Entity('playlists')
@Unique(['name'])
export class Playlist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.playlists, { eager: false })
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => Track, (track) => track.playlist, { eager: false })
  tracks: Track[];
}
