import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { TrackModule } from '../track/track.module';
import { PlaylistRepository } from './playlist.repository';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../common/constants/auth-constants';
import { TypeOrmExModule } from '../../common/modules/typeorm-module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([PlaylistRepository]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
    TrackModule,
  ],
  providers: [PlaylistService],
  controllers: [PlaylistController],
  exports: [PlaylistService],
})
export class PlaylistModule {}
