import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository, DeleteResult } from 'typeorm';
import { CreateProfileDto } from './dtos/create-profile-dto';
import { FavoriteService } from '../favorite/favorite.service';
import { updateProfileDto } from './dtos/update-profile-dto';
import { mergeDeepRight } from 'ramda';
import { AwsService } from '../../shared/modules/aws/aws.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private favoriteService: FavoriteService,
    private awsService: AwsService,
  ) {}

  async create(data: CreateProfileDto) {
    return await this.profileRepository.save(
      this.profileRepository.create({
        ...data,
        favorite: await this.favoriteService.createFavoriteList(data),
      }),
    );
  }

  async get(id: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: {
        id,
      },
    });

    if (!profile) throw new NotFoundException('profile not found');

    return profile;
  }

  async update(id: number, data: updateProfileDto) {
    const profile = await this.get(id);
    const mergeUpdateProfile = mergeDeepRight(profile, data);
    return await this.profileRepository.update(id, mergeUpdateProfile);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.profileRepository.delete(id);
  }

  async setProfileImage(id: number, image: string): Promise<Profile> {
    const profile = await this.get(id);

    const { Location } = await this.awsService.fileUpload(
      image as any,
      'profile-images',
    );

    profile.image = Location;
    return await profile.save();
  }

  async changeProfileImage(id: number, image: string): Promise<Profile> {
    const profile = await this.get(id);

    const { Location } = await this.awsService.fileUpload(
      image as any,
      'profile-images',
    );

    if (!profile.image)
      throw new ConflictException('the profile is already set to null!');

    await this.awsService.deleteFile(profile.image);
    profile.image = Location;
    return await profile.save();
  }

  async deleteProfileImage(id: number): Promise<Profile> {
    const profile = await this.get(id);

    if (!profile.image)
      throw new ConflictException('the profile is already set to null!');

    await this.awsService.deleteFile(profile.image);
    return await profile.save((profile.image = null));
  }
}
