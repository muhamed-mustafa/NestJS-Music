import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { MusicModule } from './modules/music/music.module';
import { MusicianAlbumModule } from './modules/musician-album/MusicianAlbumModule';
import { MusicianModule } from './modules/musician/musician.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SingerAlbumModule } from './modules/singer-album/singer-album.module';
import { SingerModule } from './modules/singer/singer.module';
import { SongModule } from './modules/song/song.module';
import { TrackModule } from './modules/track/track.module';
import { config } from '../config';
import { MulterModule } from '@nestjs/platform-express';
import {
  NodemailerDrivers,
  NodemailerModule,
  NodemailerOptions,
} from '@crowdlinker/nestjs-mailer';
import { UserModule } from './modules/user/user.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.db as TypeOrmModuleOptions),

    MulterModule.register({
      dest: './files',
    }),

    NodemailerModule.forRoot(
      config.nodeMailerOptions as NodemailerOptions<NodemailerDrivers.SMTP>,
    ),

    AuthModule,
    ProfileModule,
    FavoriteModule,
    MusicianAlbumModule,
    MusicModule,
    MusicianModule,
    NotificationModule,
    PlaylistModule,
    ProfileModule,
    SingerAlbumModule,
    SingerModule,
    SongModule,
    TrackModule,
    UserModule,
    FavoriteModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
  controllers: [],
})
export class AppModule {}
