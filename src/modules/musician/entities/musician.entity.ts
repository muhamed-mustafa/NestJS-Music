import { AbstractArtist } from 'src/common/classes/abstract-artist';
import { Entity, Unique, OneToMany } from 'typeorm';
import { MusicianAlbum } from '../../musician-album/entities/musician-album.entity';

@Entity('musicians')
@Unique(['name'])
export class Musician extends AbstractArtist {
  @OneToMany(() => MusicianAlbum, (musicianAlbum) => musicianAlbum.musician, {
    eager: false,
  })
  musicianAlbums: MusicianAlbum[];
}
