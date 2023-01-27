import {
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';
import { ArtistType } from 'src/common/enums/artist.enum';

export class CreateSingerDto {
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
    message: 'Info is too short',
  })
  @MaxLength(50, {
    message: 'Info is too long',
  })
  readonly info: string;

  @IsOptional()
  @IsEnum(Gender)
  readonly gender: Gender;

  @IsEnum(ArtistType)
  readonly type: ArtistType;

  @IsString()
  @MinLength(3, {
    message: 'Nationality is too short',
  })
  @MaxLength(10, {
    message: 'Nationality is too long',
  })
  readonly nationality: string;

  @IsUrl()
  @IsString()
  readonly image: string;
}
