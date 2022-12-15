import { AbstractArtist } from 'src/common/classes/abstract-artist';
import { Entity, Unique, OneToMany } from 'typeorm';
import { SingerAlbum } from '../singer-album/singer-album.entity';

@Entity('singers')
@Unique(['name'])
export class Singer extends AbstractArtist {
  @OneToMany((type) => SingerAlbum, (singerAlbum) => singerAlbum.singer, {
    eager: true,
  })
  singerAlbums: SingerAlbum[];
}
