import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractMusic } from 'src/common/classes/abstract-music';
import { MusicType } from 'src/common/enums/music-type.enum';
import { MusicianAlbum } from '../musician-album/musician-album.entity';
import { Track } from '../track/track.entity';

@Entity('musics')
export class Music extends AbstractMusic {
  @Column({ type: 'enum', enum: MusicType, array: false })
  type: MusicType;

  @ManyToOne((type) => MusicianAlbum, (musicianAlbum) => musicianAlbum.musics, {
    eager: false,
  })
  musicianAlbum: MusicianAlbum;

  @Column()
  musicianAlbumId: number;

  @OneToMany((type) => Track, (track) => track.music, { eager: true })
  tracks: Track[];
}
