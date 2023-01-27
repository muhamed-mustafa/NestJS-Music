import {
  Body,
  Get,
  Patch,
  Delete,
  Param,
  Controller,
  ParseIntPipe,
  Post,
  Query,
  HttpCode,
} from '@nestjs/common';
import { MusicianAlbumService } from './musician-album.service';
import { CreateAlbumDto } from 'src/shared/dtos/create-album-dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Roles } from '../../common/decorators/role-decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('musicians-albums')
export class MusicianAlbumController {
  constructor(private musicianAlbumService: MusicianAlbumService) {}

  @HttpCode(200)
  @Get()
  find() {
    return this.musicianAlbumService.find();
  }

  @HttpCode(200)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.musicianAlbumService.getById(id);
  }

  @HttpCode(201)
  @Post('new-album')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  createNewAlbum(
    @Body() body: CreateAlbumDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.musicianAlbumService.createNewAlbum(body, id);
  }

  @HttpCode(200)
  @Patch(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  update(@Body() body: CreateAlbumDto, @Param('id', ParseIntPipe) id: number) {
    return this.musicianAlbumService.update(id, body);
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.musicianAlbumService.delete(id);
  }
}
