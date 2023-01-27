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
} from '@nestjs/common';
import { SingerAlbumService } from './singer-album.service';
import { CreateAlbumDto } from 'src/shared/dtos/create-album-dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../common/decorators/role-decorator';
import { HttpCode } from '@nestjs/common/decorators';

@Controller('singers-albums')
export class SingerAlbumController {
  constructor(private singerAlbumService: SingerAlbumService) {}

  @HttpCode(200)
  @Get()
  find() {
    return this.singerAlbumService.find();
  }

  @HttpCode(200)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.singerAlbumService.getById(id);
  }

  @HttpCode(201)
  @Post('new-album')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  createNewAlbum(
    @Body() body: CreateAlbumDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.singerAlbumService.createNewAlbum(body, id);
  }

  @HttpCode(200)
  @Patch(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  update(@Body() body: CreateAlbumDto, @Param('id', ParseIntPipe) id: number) {
    return this.singerAlbumService.update(id, body);
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.singerAlbumService.delete(id);
  }

  @HttpCode(200)
  @Delete('clear/:id')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  clear(@Param('id', ParseIntPipe) id: number) {
    return this.singerAlbumService.clearSingerAlbum(id);
  }
}
