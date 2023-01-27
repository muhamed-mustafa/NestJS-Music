import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AbstractAlbum } from 'src/common/classes/abstract-album';
import { Singer } from '../../singer/entities/singer.entity';
import { Song } from '../../song/entities/song.entity';

@Entity('singer-albums')
@Unique(['name'])
export class SingerAlbum extends AbstractAlbum {
  @ManyToOne(() => Singer, (singer) => singer.singerAlbums, {
    eager: false,
  })
  singer: Singer;

  @Column()
  singerId: number;

  @OneToMany(() => Song, (song) => song.singerAlbum, { eager: false })
  songs: Song[];
}
