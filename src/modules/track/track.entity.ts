import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Generated,
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { Playlist } from '../playlist/playlist.entity';
import { Music } from '../music/music.entity';
import { Favorite } from '../favorite/favorite.entity';
import { Song } from '../song/song.entity';

@Entity('tracks')
export class Track extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Generated()
  @Column()
  index: number;

  @ManyToOne((type) => Playlist, (playlist) => playlist.tracks, {
    eager: false,
  })
  playlist: Playlist;

  @ManyToOne((type) => Favorite, (favorite) => favorite.tracks, {
    eager: false,
  })
  favorite: Favorite;

  @ManyToOne((type) => Music, (music) => music.tracks, {
    eager: false,
  })
  music: Music;

  @ManyToOne((type) => Song, (song) => song.tracks, {
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
