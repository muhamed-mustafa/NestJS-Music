import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { FavoriteService } from './favorite.service';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../common/constants/auth-constants';
import { TrackModule } from '../track/track.module';
import { FavoriteController } from './favorite.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
    TrackModule,
  ],
  controllers: [FavoriteController],
  exports: [FavoriteService],
  providers: [FavoriteService],
})
export class FavoriteModule {}
