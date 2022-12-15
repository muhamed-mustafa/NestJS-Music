import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AbstractAlbum } from 'src/common/classes/abstract-album';
import { Singer } from '../singer/singer.entity';
import { Song } from '../song/song.entity';

@Entity('singer-albums')
@Unique(['name'])
export class SingerAlbum extends AbstractAlbum {
  @ManyToOne((type) => Singer, (singer) => singer.singerAlbums, {
    eager: false,
  })
  singer: Singer;

  @Column()
  singerId: number;

  @OneToMany((type) => Song, (song) => song.singerAlbum, { eager: true })
  songs: Song[];
}
