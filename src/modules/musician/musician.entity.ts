import { AbstractArtist } from 'src/common/classes/abstract-artist';
import { Entity, Unique, OneToMany } from 'typeorm';
import { MusicianAlbum } from '../musician-album/musician-album.entity';

@Entity('musicians')
@Unique(['name'])
export class Musician extends AbstractArtist {
  @OneToMany(
    (type) => MusicianAlbum,
    (musicianAlbum) => musicianAlbum.musician,
    { eager: true },
  )
  musicianAlbums: MusicianAlbum[];
}
