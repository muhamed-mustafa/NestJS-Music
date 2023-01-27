import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmExModule } from 'src/common/modules/typeorm-module';
import { UserRepository } from './repositories/user.repository';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../common/constants/auth-constants';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    ProfileModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
