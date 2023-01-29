import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { DeleteResult } from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { UserRepository } from './repositories/user.repository';
import { Profile } from '../profile/entities/profile.entity';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private profileService: ProfileService,
  ) {}

  async find(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async editRole(id: number, role: Role): Promise<User> {
    const user = await this.findOne(id);
    user.role = role;
    return await user.save();
  }

  async getCurrentUser(user: User): Promise<{ user: User; profile: Profile }> {
    const profile = await this.profileService.get(user.profileId);
    return { ...user, ...profile };
  }

  async findUser({
    nickname,
    clientId,
  }: {
    nickname?: string;
    clientId?: string;
  }): Promise<User> {
    let user: User;

    if (nickname)
      user = await this.userRepository.findOne({
        where: {
          username: nickname,
        },
      });
    else
      await this.userRepository.findOne({
        where: {
          clientId,
        },
      });

    return user;
  }
}
