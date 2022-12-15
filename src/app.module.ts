import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from '../config';
import { AuthModule } from './modules/auth/auth.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { MusicModule } from './modules/music/music.module';
import { MusicianAlbumModule } from './modules/musician-album/musician-album.module';
import { MusicianModule } from './modules/musician/musician.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SingerAlbumModule } from './modules/singer-album/singer-album.module';
import { SingerModule } from './modules/singer/singer.module';
import { SongModule } from './modules/song/song.module';
import { TrackModule } from './modules/track/track.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.db as TypeOrmModuleOptions),
    AuthModule,
    FavoriteModule,
    MusicModule,
    MusicianAlbumModule,
    MusicianModule,
    NotificationModule,
    PlaylistModule,
    ProfileModule,
    SingerAlbumModule,
    SingerModule,
    SongModule,
    TrackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
