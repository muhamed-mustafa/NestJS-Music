import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { CreateProfileDto } from '../profile/dtos/create-profile-dto';
import { LoginDto } from './dtos/login.dto';
import { Body, Post, Controller, UseGuards, Get } from '@nestjs/common';
import { Delete, HttpCode, Patch, Req, Res } from '@nestjs/common/decorators';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from '../../common/guards/user.guard';
import { Roles } from '../../common/decorators/role-decorator';
import { Role } from '../../common/enums/role.enum';
import { getAuthenticatedUser } from '../../common/decorators/authenticated-user-decorator';
import { User } from '../user/entities/user.entity';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  signInWithGoogle() {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  signInWithGoogleRedirect(@Req() req: any, @Res() res: Response) {
    const { token } = req.user;

    if (!token) {
      res.redirect('http://localhost:3000/auth/google-failure');
    } else {
      res.redirect(
        `http://localhost:3000/auth/google-success/accessToken:${token}`,
      );
    }
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookLoginCallback(@Req() req, @Res() res) {
    const { token } = req.user;

    if (!token) {
      res.redirect('http://localhost:3000/auth/facebook-failure');
    } else {
      res.redirect(
        `http://localhost:3000/auth/facebook-success/accessToken:${token}`,
      );
    }
  }

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
