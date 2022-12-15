import { BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ArtistType } from '../enums/artist.enum';
import { Gender } from '../enums/gender.enum';

export abstract class AbstractArtist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  info: string;

  @Column()
  image: string;

  @Column({ type: 'enum', enum: ArtistType, array: false })
  type: ArtistType;

  @Column({ nullable: true })
  gender: Gender;

  @Column()
  nationality: string;
}
