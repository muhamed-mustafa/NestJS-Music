import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingerAlbum } from './singer-album.entity';

@Module({ imports: [TypeOrmModule.forFeature([SingerAlbum])] })
export class SingerAlbumModule {}
