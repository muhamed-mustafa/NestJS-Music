import { AbstractArtist } from 'src/common/classes/abstract-artist';
import { Entity, Unique, OneToMany } from 'typeorm';
import { SingerAlbum } from '../../singer-album/entities/singer-album.entity';

@Entity('singers')
@Unique(['name'])
export class Singer extends AbstractArtist {
  @OneToMany(() => SingerAlbum, (singerAlbum) => singerAlbum.singer, {
    eager: false,
  })
  singerAlbums: SingerAlbum[];
}
