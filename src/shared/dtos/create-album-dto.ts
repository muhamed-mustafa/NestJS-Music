import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @MinLength(4, {
    message: 'Name is too short',
  })
  @MaxLength(15, {
    message: 'Name is too long',
  })
  name: string;
}
