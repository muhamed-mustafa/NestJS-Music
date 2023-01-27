import { ArtistType } from '../enums/artist.enum';
import { Gender } from '../enums/gender.enum';
import { MusicType } from '../enums/music-type.enum';
import { SongLanguage } from '../enums/song-language.enum';
import { SongType } from '../enums/song-type.enum';

export interface FilterFields {
  limit?: number;
  type?: MusicType | SongType | ArtistType;
  language?: SongLanguage;
  gender?: Gender;
  rate?: number;
  nationality?: string;
}
