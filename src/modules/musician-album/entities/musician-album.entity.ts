import { Entity, Column, ManyToOne, Unique, OneToMany } from 'typeorm';
import { AbstractAlbum } from 'src/common/classes/abstract-album';
import { Musician } from '../../musician/entities/musician.entity';
import { Music } from '../../music/entities/music.entity';

@Entity('musician-albums')
@Unique(['name'])
export class MusicianAlbum extends AbstractAlbum {
  @ManyToOne(() => Musician, (musician) => musician.musicianAlbums, {
    eager: false,
  })
  musician: Musician;

  @Column()
  musicianId: number;

  @OneToMany(() => Music, (music) => music.musicianAlbum, { eager: false })
  musics: Music[];
}
