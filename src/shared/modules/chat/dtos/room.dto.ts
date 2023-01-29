import { IsString, MaxLength, MinLength } from 'class-validator';

export class RoomDto {
  @IsString()
  @MinLength(4, {
    message: 'roomName is too short',
  })
  @MaxLength(15, {
    message: 'roomName is too long',
  })
  name: string;
}
