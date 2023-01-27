import { IsString, IsEnum, MinLength, MaxLength, IsUrl } from 'class-validator';
import { MusicType } from '../../../common/enums/music-type.enum';

export class CreateMusicDto {
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

  @IsEnum(MusicType)
  readonly type: MusicType;

  @IsUrl()
  @IsString()
  source: string;
}
