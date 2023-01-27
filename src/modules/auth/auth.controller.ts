import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { CreateProfileDto } from '../profile/dtos/create-profile-dto';
import { LoginDto } from './dtos/login.dto';
import { Body, Post, Controller, UseGuards } from '@nestjs/common';
import { Delete, HttpCode, Patch } from '@nestjs/common/decorators';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from '../../common/guards/user.guard';
import { Roles } from '../../common/decorators/role-decorator';
import { Role } from '../../common/enums/role.enum';
import { getAuthenticatedUser } from '../../common/decorators/authenticated-user-decorator';
import { User } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @Post('signup')
  signup(
    @Body('authDto') authDto: SignUpDto,
    @Body('profileDto') profileDto: CreateProfileDto,
  ) {
    return this.authService.signUp(authDto, profileDto);
  }

  @HttpCode(200)
  @Post('login')
  login(@Body() { email, password }: LoginDto) {
    return this.authService.signIn({ email, password });
  }

  @HttpCode(200)
  @Patch('verify-email')
  verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @HttpCode(200)
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.sendEmailForgottenPassword(email);
  }

  @HttpCode(200)
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @HttpCode(204)
  @Delete()
  @UseGuards(AuthGuard(), UserGuard)
  @Roles([Role.USER])
  deleteUserAccount(@getAuthenticatedUser() user: User) {
    return this.authService.deleteUserAccount(user);
  }
}
