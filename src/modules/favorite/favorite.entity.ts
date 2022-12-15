import {
  PrimaryGeneratedColumn,
  OneToOne,
  BaseEntity,
  Entity,
  OneToMany,
} from 'typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { Track } from '../track/track.entity';

@Entity('favorite-lists')
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => Profile, (profile) => profile.favorite)
  profile: Profile;

  @OneToMany((type) => Track, (track) => track.favorite, { eager: true })
  tracks: Track[];
}
