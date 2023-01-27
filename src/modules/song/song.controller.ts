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
} from '@nestjs/common';
import { SongService } from './song.service';
import { FilterFields } from '../../common/interfaces/filter-fields';
import { CreateSongDto } from './dtos/create-song-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateSongDto } from './dtos/update-song-dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from '../../common/guards/user.guard';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../common/decorators/role-decorator';
import { AdminGuard } from '../../common/guards/admin.guard';
import { HttpCode } from '@nestjs/common/decorators';

@Controller('songs')
export class SongController {
  constructor(private songService: SongService) {}

  @HttpCode(200)
  @Get()
  find() {
    return this.songService.find();
  }

  @HttpCode(200)
  @Get('limited')
  getByLimit(@Query('limit') limit: number) {
    return this.songService.getByLimit(limit);
  }

  @HttpCode(200)
  @Get('filtered')
  filter(@Query() query: FilterFields) {
    return this.songService.filter(query);
  }

  @HttpCode(200)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.songService.getById(id);
  }

  @HttpCode(201)
  @UseInterceptors(FileInterceptor('source'))
  @Post()
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  create(
    @Body() body: CreateSongDto,
    @Query() singerAlbumId: number,
    @UploadedFile() source: string,
  ) {
    return this.songService.create({ ...body, source }, singerAlbumId);
  }

  @HttpCode(200)
  @UseInterceptors(FileInterceptor('source'))
  @Patch(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  update(
    @Body() body: UpdateSongDto,
    @UploadedFile() source: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.songService.update(id, {
      ...body,
      source,
    });
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.songService.delete(id);
  }

  @HttpCode(200)
  @Post(':songId/add-to-playlist/:playlistId')
  @UseGuards(AuthGuard(), UserGuard)
  @Roles([Role.USER])
  addToPlaylist(
    @Param('songId', ParseIntPipe) songId: number,
    @Param('playlistId', ParseIntPipe) playlistId: number,
  ) {
    return this.songService.pushSongToPlaylist(songId, playlistId);
  }

  @HttpCode(200)
  @Post(':songId/save-to-favorite-list/:favoriteId')
  @UseGuards(AuthGuard(), UserGuard)
  @Roles([Role.USER])
  saveToFavoriteList(
    @Param('songId', ParseIntPipe) songId: number,
    @Param('favoriteId', ParseIntPipe) favoriteId: number,
  ) {
    return this.songService.pushSongToFavorite(songId, favoriteId);
  }
}
