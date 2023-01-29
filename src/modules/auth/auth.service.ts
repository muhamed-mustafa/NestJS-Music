import 'dotenv/config';
import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { EmailVerification } from './entities/email-verification.entity';
import { Nodemailer, NodemailerDrivers } from '@crowdlinker/nestjs-mailer';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from '../profile/profile.service';
import { SignUpDto } from './dtos/signup.dto';
import { CreateProfileDto } from '../profile/dtos/create-profile-dto';
import { Repository } from 'typeorm';
import { NotFoundException, forwardRef } from '@nestjs/common';
import { JwtPayload } from 'src/common/interfaces/jwt-payload';
import { LoginDto } from './dtos/login.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { ForgottenPassword } from './entities/forgotten-password.entity';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { FavoriteService } from '../favorite/favorite.service';
import { PlaylistService } from '../playlist/playlist.service';
import { ChatService } from '../../shared/modules/chat/chat.service';
import { Inject } from '@nestjs/common/decorators';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    @InjectRepository(EmailVerification)
    private emailVerification: Repository<EmailVerification>,
    @InjectRepository(ForgottenPassword)
    private forgottenPassword: Repository<ForgottenPassword>,
    private nodeMailerService: Nodemailer<NodemailerDrivers.SMTP>,
    private jwtService: JwtService,
    private profileService: ProfileService,
    private favoriteService: FavoriteService,
    private playlistService: PlaylistService,
    @Inject(forwardRef(() => ChatService)) private chatService: ChatService,
  ) {}

  async signUp(
    data: SignUpDto,
    createProfileDto: CreateProfileDto,
  ): Promise<User> {
    const { email, password, username } = data;

    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail)
      throw new BadRequestException('email is exist, choose another one.');

    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername)
      throw new BadRequestException('username is exist, choose another one.');

    const salt = await this.userRepository.generateSalt(12);
    const hashedPassword = await this.userRepository.hashPassword(
      password,
      salt,
    );

    const [user] = await Promise.all([
      await this.userRepository.save(
        this.userRepository.create({
          ...data,
          password: hashedPassword,
          profile: await this.profileService.create(createProfileDto),
        }),
      ),
      await this.createEmailToken(email),
      await this.sendEmailVerification(email),
    ]);

    return user;
  }

  async signIn({ email, password }: LoginDto): Promise<{
    token: string;
  }> {
    await this.userRepository.validateUserPassword({ email, password });
    const token = await this.generateJwtToken({ email });
    return { token };
  }

  async createEmailToken(email: string): Promise<EmailVerification> {
    const verifiedEmail = await this.emailVerification.findOne({
      where: {
        email,
      },
    });

    if (
      verifiedEmail &&
      new Date().getTime() - verifiedEmail.timestamp.getTime() / 6000 < 15
    ) {
      throw new HttpException(
        'EMAIL_TOKEN_ALREADY_SENT',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const emailToken = Math.floor(100000 + Math.random() * 900000).toString();
    return await this.emailVerification.save(
      this.emailVerification.create({
        emailToken,
        email,
      }),
    );
  }

  async sendEmailVerification(email: string): Promise<any> {
    const verifiedEmail = await this.emailVerification.findOne({
      where: {
        email,
      },
    });

    if (!verifiedEmail && !verifiedEmail.emailToken) {
      throw new HttpException('WRONG_EMAIL_TOKEN', HttpStatus.FORBIDDEN);
    }

    try {
      const subject = 'Verify Your Email Please.';
      const html = `<h1>Hi ${email}</h1> <h1>Your Email Token ${verifiedEmail.emailToken}</h1> <br><br> <h2>Thanks for your registration</h2>`;
      return await this.sendMail({ email, subject, html });
    } catch (err) {
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyEmail(token: string): Promise<{
    isVerified: boolean;
  }> {
    const verifiedEmail = await this.emailVerification.findOne({
      where: {
        emailToken: token,
      },
    });

    if (!verifiedEmail.emailToken) {
      throw new HttpException(
        'EMAIL_TOKEN_CODE_NOT_VALID',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userRepository.findByEmail(verifiedEmail.email);
    if (!user) throw new NotFoundException('User Not Found');

    await Promise.all([
      (user.isVerified = true),
      await user.save(),
      await verifiedEmail.remove(),
    ]);

    return { isVerified: true };
  }

  async createForgottenPasswordToken(
    email: string,
  ): Promise<ForgottenPassword> {
    const forgottenPassword = await this.forgottenPassword.findOne({
      where: {
        email,
      },
    });

    if (
      forgottenPassword &&
      new Date().getTime() - forgottenPassword.timestamp.getTime() / 6000 < 15
    ) {
      throw new HttpException(
        'RESET_PASSWORD_TOKEN_SENT_RECENTLY',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const newPasswordToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    return await this.forgottenPassword.save(
      this.forgottenPassword.create({
        newPasswordToken,
        email,
      }),
    );
  }

  async sendEmailForgottenPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User Not Found');

    const token = await this.createForgottenPasswordToken(email);
    if (!token && token.newPasswordToken) {
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const html = `<h1>Hi ${email}</h1> <br><br> <h2>You have requested to reset your password</h2> <h2>Your Reset password Code ${token.newPasswordToken}</h2>`;
      const subject = 'Reset Your Password';
      return await this.sendMail({ email, subject, html });
    } catch (err) {
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword({
    newPassword,
    newPasswordToken,
  }: ResetPasswordDto): Promise<boolean> {
    let isNewPasswordChanged = false;

    const forgottenPassword = await this.forgottenPassword.findOne({
      where: { newPasswordToken },
    });

    if (!forgottenPassword) {
      throw new HttpException(
        'WRONG_RESET_PASSWORD_TOKEN',
        HttpStatus.CONFLICT,
      );
    }

    isNewPasswordChanged = await this.setNewPassword(
      forgottenPassword.email,
      newPassword,
    );

    if (isNewPasswordChanged) {
      await this.forgottenPassword.delete(forgottenPassword.id);
    }

    return isNewPasswordChanged;
  }

  async setNewPassword(email: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User Not Found');

    const salt = await this.userRepository.generateSalt(12);
    user.password = await this.userRepository.hashPassword(password, salt);
    await user.save();

    return true;
  }

  async deleteUserAccount(user: User) {
    const profile = await this.profileService.get(user.id);
    await Promise.all([
      user.playlists.map(
        async (playlist) => await this.playlistService.delete(playlist.id),
      ),
      await this.profileService.delete(profile.id),
      await this.favoriteService.deleteFavoriteList(profile.favoriteId),
      this.chatService.deleteUserJoinedRooms(user),
      this.chatService.deleteUserMessages(user),
      await this.userRepository.delete(user.id),
    ]);
  }

  async generateJwtToken({ email }: JwtPayload): Promise<string> {
    return this.jwtService.sign({ email });
  }

  async sendMail({
    email,
    subject,
    html,
  }: {
    email: string;
    subject: string;
    html: string;
  }) {
    return await this.nodeMailerService.sendMail({
      from: `${process.env.EMAIL_USER}`,
      to: email,
      subject: subject,
      html,
    });
  }
}
