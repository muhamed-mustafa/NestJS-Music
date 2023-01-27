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
import { MusicianService } from './musician.service';
import { FilterFields } from '../../common/interfaces/filter-fields';
import { CreateMusicianDto } from './dtos/create-musician-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateMusicianDto } from './dtos/update-musician-dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/role-decorator';
import { Role } from '../../common/enums/role.enum';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('musicians')
export class MusicianController {
  constructor(private musicianService: MusicianService) {}

  @HttpCode(200)
  @Get()
  find() {
    return this.musicianService.find();
  }

  @HttpCode(200)
  @Get('limited')
  getByLimit(@Query('limit') limit: number) {
    return this.musicianService.getByLimit(limit);
  }

  @HttpCode(200)
  @Get('filtered')
  filter(@Query() query: FilterFields) {
    return this.musicianService.filter(query);
  }

  @HttpCode(200)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.musicianService.getById(id);
  }

  @HttpCode(201)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  create(@Body() body: CreateMusicianDto, @UploadedFile() image: string) {
    return this.musicianService.create({ ...body, image });
  }

  @HttpCode(200)
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(
    @Body() body: UpdateMusicianDto,
    @UploadedFile() image: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.musicianService.update(id, {
      ...body,
      ...(image && { image }),
    });
  }

  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.musicianService.delete(id);
  }
}
