import { Module, forwardRef } from '@nestjs/common';
import { MusicRepository } from './music.repository';
import { MusicService } from './music.service';
import { AwsModule } from '../../shared/modules/aws/aws.module';
import { MusicController } from './music.controller';
import { TypeOrmExModule } from 'src/common/modules/typeorm-module';
import { MusicianAlbumModule } from '../musician-album/MusicianAlbumModule';
import { FavoriteModule } from '../favorite/favorite.module';
import { TrackModule } from '../track/track.module';
import { PlaylistModule } from '../playlist/playlist.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../common/constants/auth-constants';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([MusicRepository]),
    AwsModule,
    forwardRef(() => MusicianAlbumModule),
    FavoriteModule,
    TrackModule,
    PlaylistModule,
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
  ],
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService],
})
export class MusicModule {}
