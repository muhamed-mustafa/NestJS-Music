import { IsString } from 'class-validator';

export class NotificationPayloadDto {
  @IsString()
  title: string;

  @IsString()
  body: string;
}
