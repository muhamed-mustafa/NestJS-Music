import { forwardRef, Module } from '@nestjs/common';
import { SongRepository } from './song.repository';
import { SongService } from './song.service';
import { AwsModule } from '../../shared/modules/aws/aws.module';
import { SongController } from './song.controller';
import { TypeOrmExModule } from 'src/common/modules/typeorm-module';
import { SingerAlbumModule } from '../singer-album/singer-album.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { TrackModule } from '../track/track.module';
import { PlaylistModule } from '../playlist/playlist.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../common/constants/auth-constants';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([SongRepository]),
    forwardRef(() => SingerAlbumModule),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
    AwsModule,
    FavoriteModule,
    TrackModule,
    PlaylistModule,
  ],
  controllers: [SongController],
  providers: [SongService],
  exports: [SongService],
})
export class SongModule {}
