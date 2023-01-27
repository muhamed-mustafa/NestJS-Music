import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Body,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/role-decorator';
import { UserGuard } from 'src/common/guards/user.guard';
import { Role } from '../../common/enums/role.enum';
import { PlaylistService } from './playlist.service';
import { User } from '../user/entities/user.entity';
import { getAuthenticatedUser } from '../../common/decorators/authenticated-user-decorator';
import { Post } from '@nestjs/common';
import { PlayListDto } from './dtos/create-playlist-dto';
import { HttpCode } from '@nestjs/common/decorators';

@UseGuards(AuthGuard(), UserGuard)
@Roles([Role.USER])
@Controller('playlists')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @HttpCode(200)
  @Get()
  getUserPlayList(@getAuthenticatedUser() user: User) {
    return this.playlistService.getUserPlaylists(user);
  }

  @HttpCode(200)
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.playlistService.get(id);
  }

  @HttpCode(201)
  @Post()
  create(@getAuthenticatedUser() user: User, @Body() data: PlayListDto) {
    return this.playlistService.create(user, data);
  }

  @HttpCode(200)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: PlayListDto) {
    return this.playlistService.update(id, data);
  }

  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.playlistService.delete(id);
  }

  @HttpCode(200)
  @Delete(':playlistId/:trackId')
  removeTrackFromPlayList(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('trackId', ParseIntPipe) trackId: number,
  ) {
    return this.playlistService.removeTrackFromPlayList(playlistId, trackId);
  }
}
