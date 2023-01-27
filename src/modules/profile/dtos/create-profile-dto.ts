import {
  IsInt,
  IsString,
  Length,
  Max,
  Min,
  IsIn,
  IsMobilePhone,
  IsOptional,
} from 'class-validator';
import { Gender } from '../../../common/enums/gender.enum';

export class CreateProfileDto {
  @IsString()
  @Length(3, 20)
  readonly firstName: string;

  @IsString()
  @Length(3, 20)
  readonly lastName: string;

  @IsInt()
  @Min(10)
  @Max(60)
  readonly age: number;

  @IsMobilePhone('ar-EG', { strictMode: true })
  readonly phone: string;

  @IsIn([Gender.FEMALE, Gender.MALE])
  readonly gender: Gender;

  @IsString()
  @Length(3, 20)
  readonly country: string;

  @IsString()
  @Length(3, 20)
  readonly city: string;

  @IsString()
  @Length(3, 20)
  readonly address: string;

  @IsOptional()
  @IsString()
  image: string;
}
