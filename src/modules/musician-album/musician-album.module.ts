import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicianAlbum } from './musician-album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MusicianAlbum])],
})
export class MusicianAlbumModule {}
