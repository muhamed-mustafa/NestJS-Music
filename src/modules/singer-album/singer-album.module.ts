import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingerAlbum } from './entities/singer-album.entity';
import { SongModule } from '../song/song.module';
import { SingerAlbumService } from './singer-album.service';
import { SingerAlbumController } from './singer-album.controller';
import { SingerModule } from '../singer/singer.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../common/constants/auth-constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([SingerAlbum]),
    SingerModule,
    forwardRef(() => SongModule),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
  ],
  controllers: [SingerAlbumController],
  providers: [SingerAlbumService],
  exports: [SingerAlbumService],
})
export class SingerAlbumModule {}
