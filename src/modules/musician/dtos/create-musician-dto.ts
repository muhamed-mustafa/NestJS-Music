import {
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { ArtistType } from '../../../common/enums/artist.enum';
import { Gender } from 'src/common/enums/gender.enum';

export class CreateMusicianDto {
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
    message: 'info is too short',
  })
  @MaxLength(50, {
    message: 'info is too long',
  })
  readonly info: string;

  @IsEnum(Gender)
  readonly gender: Gender;

  @IsEnum(ArtistType)
  readonly type: ArtistType;

  @IsUrl()
  @IsString()
  image: string;
}
