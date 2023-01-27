import {
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { SongType } from '../../../common/enums/song-type.enum';
import { SongLanguage } from '../../../common/enums/song-language.enum';

export class CreateSongDto {
  @IsString()
  @MinLength(5, {
    message: 'Name is too short',
  })
  @MaxLength(15, {
    message: 'Name is too long',
  })
  readonly name: string;

  @IsString()
  @MinLength(5, {
    message: 'description is too short',
  })
  @MaxLength(50, {
    message: 'description is too long',
  })
  readonly description: string;

  @IsString()
  @MinLength(5, {
    message: 'artist is too short',
  })
  @MaxLength(50, {
    message: 'artist is too long',
  })
  readonly artist: string;

  @IsEnum(SongType)
  readonly type: SongType;

  @IsEnum(SongLanguage)
  readonly language: SongLanguage;

  @IsUrl()
  @IsString()
  source: string;

  @IsUrl()
  @IsString()
  @IsOptional()
  tempImage: string;
}
