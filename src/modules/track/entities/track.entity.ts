import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Generated,
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { Playlist } from '../../playlist/entities/playlist.entity';
import { Music } from '../../music/entities/music.entity';
import { Song } from '../../song/entities/song.entity';
import { Favorite } from 'src/modules/favorite/entities/favorite.entity';

@Entity('tracks')
export class Track extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  link: string;

  @Generated()
  @Column()
  index: number;

  @ManyToOne(() => Playlist, (playlist) => playlist.tracks, {
    eager: false,
  })
  playlist: Playlist;

  @ManyToOne(() => Favorite, (favorite) => favorite.tracks, {
    eager: false,
  })
  favorite: Favorite;

  @ManyToOne(() => Music, (music) => music.tracks, {
    eager: false,
  })
  music: Music;

  @ManyToOne(() => Song, (song) => song.tracks, {
    eager: false,
  })
  song: Song;

  @Column({ nullable: true })
  playlistId: number;

  @Column({ nullable: true })
  favoriteId: number;

  @Column({ nullable: true })
  songId: number;

  @Column({ nullable: true })
  musicId: number;
}
