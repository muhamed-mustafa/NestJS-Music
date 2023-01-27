import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicianAlbum } from './entities/musician-album.entity';
import { MusicianAlbumController } from './musician-album.controller';
import { MusicianAlbumService } from './musician-album.service';
import { MusicModule } from '../music/music.module';
import { MusicianModule } from '../musician/musician.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../common/constants/auth-constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([MusicianAlbum]),
    MusicianModule,
    forwardRef(() => MusicModule),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
  ],
  controllers: [MusicianAlbumController],
  providers: [MusicianAlbumService],
  exports: [MusicianAlbumService],
})
export class MusicianAlbumModule {}
