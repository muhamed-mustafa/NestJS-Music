import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AbstractMusic } from 'src/common/classes/abstract-music';
import { SongType } from 'src/common/enums/song-type.enum';
import { SongLanguage } from 'src/common/enums/song-language.enum';
import { SingerAlbum } from '../singer-album/singer-album.entity';
import { Track } from '../track/track.entity';

@Entity('songs')
@Unique(['name', 'source'])
export class Song extends AbstractMusic {
  @Column({ type: 'enum', enum: SongType, array: false })
  type: SongType;

  @Column({ type: 'enum', enum: SongLanguage, array: false })
  language: SongLanguage;

  @ManyToOne((type) => SingerAlbum, (singerAlbum) => singerAlbum.songs, {
    eager: false,
  })
  singerAlbum: SingerAlbum;

  @Column()
  singerAlbumId: number;

  @OneToMany((type) => Track, (track) => track.song, { eager: true })
  tracks: Track[];
}
