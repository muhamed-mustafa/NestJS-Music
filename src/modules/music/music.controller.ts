import {
  Body,
  Get,
  Patch,
  Delete,
  Param,
  Post,
  Query,
  Controller,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { FilterFields } from '../../common/interfaces/filter-fields';
import { CreateMusicDto } from './dto/create-music-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { updateMusicDto } from './dto/update-music-dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from '../../common/guards/user.guard';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../common/decorators/role-decorator';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('musics')
export class MusicController {
  constructor(private musicService: MusicService) {}

  @HttpCode(200)
  @Get()
  find() {
    return this.musicService.find();
  }

  @HttpCode(200)
  @Get('limited')
  getByLimit(@Query('limit') limit: number) {
    return this.musicService.getByLimit(limit);
  }

  @HttpCode(200)
  @Get('filtered')
  filter(@Query() query: FilterFields) {
    return this.musicService.filter(query);
  }

  @HttpCode(200)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.musicService.getById(id);
  }

  @HttpCode(201)
  @UseInterceptors(FileInterceptor('source'))
  @Post()
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  create(
    @Body() body: CreateMusicDto,
    @Query('musicianAlbum', ParseIntPipe) musicianAlbum: number,
    @UploadedFile() source: string,
  ) {
    return this.musicService.create({ ...body, source }, musicianAlbum);
  }

  @HttpCode(200)
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  update(
    @Body() body: updateMusicDto,
    @UploadedFile() source: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.musicService.update(id, { ...body, ...(source && { source }) });
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.musicService.delete(id);
  }

  @HttpCode(200)
  @Post(':musicId/add-to-playlist/:playlistId')
  @UseGuards(AuthGuard(), UserGuard)
  @Roles([Role.USER])
  addToPlaylist(
    @Param('musicId', ParseIntPipe) musicId: number,
    @Param('playlistId', ParseIntPipe) playlistId: number,
  ) {
    return this.musicService.pushMusicToPlayList(musicId, playlistId);
  }

  @HttpCode(200)
  @Post(':musicId/save-to-favorite-list/:favoriteId')
  @UseGuards(AuthGuard(), UserGuard)
  @Roles([Role.USER])
  saveToFavoriteList(
    @Param('musicId', ParseIntPipe) musicId: number,
    @Param('favoriteId', ParseIntPipe) favoriteId: number,
  ) {
    return this.musicService.pushMusicToFavorite(musicId, favoriteId);
  }
}
