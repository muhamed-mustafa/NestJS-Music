import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthConstants } from '../../common/constants/auth-constants';
import { JwtStrategy } from './strategies/jwt-strategy';
import { ProfileModule } from '../profile/profile.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailVerification } from './entities/email-verification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForgottenPassword } from './entities/forgotten-password.entity';
import { User } from '../user/entities/user.entity';
import { TypeOrmExModule } from '../../common/modules/typeorm-module';
import { UserRepository } from '../user/repositories/user.repository';
import { PlaylistModule } from '../playlist/playlist.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { ChatModule } from '../../shared/modules/chat/chat.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
    JwtModule.register({
      secret: AuthConstants.secretKey,
      signOptions: {
        expiresIn: AuthConstants.expiresIn,
      },
    }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    TypeOrmModule.forFeature([User, EmailVerification, ForgottenPassword]),
    ProfileModule,
    PlaylistModule,
    FavoriteModule,
    ChatModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, JwtModule, PassportModule],
})
export class AuthModule {}
