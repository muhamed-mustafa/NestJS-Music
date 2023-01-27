import {
  PrimaryGeneratedColumn,
  OneToOne,
  BaseEntity,
  Entity,
  OneToMany,
} from 'typeorm';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { Track } from '../../track/entities/track.entity';

@Entity('favorite-lists')
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Profile, (profile) => profile.favorite)
  profile: Profile;

  @OneToMany(() => Track, (track) => track.favorite, { eager: true })
  tracks: Track[];
}
