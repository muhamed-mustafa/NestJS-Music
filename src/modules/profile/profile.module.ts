import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { ProfileService } from './profile.service';
import { FavoriteModule } from '../favorite/favorite.module';
import { AuthConstants } from '../../common/constants/auth-constants';
import { PassportModule } from '@nestjs/passport';
import { AwsModule } from '../../shared/modules/aws/aws.module';
import { ProfileController } from './profile.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
    AwsModule,
    FavoriteModule,
  ],
  controllers: [ProfileController],
  exports: [ProfileService],
  providers: [ProfileService],
})
export class ProfileModule {}
