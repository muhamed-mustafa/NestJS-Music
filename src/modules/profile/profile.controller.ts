import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProfileDto } from './dtos/create-profile-dto';
import { getAuthenticatedUser } from 'src/common/decorators/authenticated-user-decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { Roles } from '../../common/decorators/role-decorator';
import { Role } from '../../common/enums/role.enum';
import { AcceptedAuthGuard } from '../../common/guards/accepted-auth.guard';
import { HttpCode } from '@nestjs/common/decorators';

@UseGuards(AuthGuard(), AcceptedAuthGuard)
@Roles([Role.ADMIN, Role.USER])
@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @HttpCode(200)
  @Get()
  getUserProfile(@getAuthenticatedUser() user: User) {
    return this.profileService.get(user.profileId);
  }

  @HttpCode(200)
  @Patch()
  editProfile(
    @getAuthenticatedUser() user: User,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.profileService.update(user.profileId, createProfileDto);
  }

  @HttpCode(200)
  @Patch('set-profile-image')
  @UseInterceptors(FileInterceptor('image'))
  setProfileImage(
    @getAuthenticatedUser() user: User,
    @UploadedFile() image: string,
  ) {
    return this.profileService.setProfileImage(user.profileId, image);
  }

  @HttpCode(200)
  @Patch('change-profile-image')
  @UseInterceptors(FileInterceptor('image'))
  changeProfileImage(
    @getAuthenticatedUser() user: User,
    @UploadedFile() image: any,
  ) {
    return this.profileService.changeProfileImage(user.profileId, image);
  }

  @HttpCode(204)
  @Delete('delete-profile-image')
  deleteProfileImage(@getAuthenticatedUser() user: User) {
    return this.profileService.deleteProfileImage(user.profileId);
  }
}
