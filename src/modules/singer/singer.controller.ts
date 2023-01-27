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
import { SingerService } from './singer.service';
import { FilterFields } from '../../common/interfaces/filter-fields';
import { CreateSingerDto } from './dtos/create-singer-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileUpload } from '../../shared/upload';
import { UpdateSingerDto } from './dtos/update-singer-dto';
import { UseGuards, HttpCode } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Roles } from 'src/common/decorators/role-decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('singers')
export class SingerController {
  constructor(private singerService: SingerService) {}

  @HttpCode(200)
  @Get()
  find() {
    return this.singerService.find();
  }

  @HttpCode(200)
  @Get('limited')
  getByLimit(@Query('limit') limit: number) {
    return this.singerService.getByLimit(limit);
  }

  @HttpCode(200)
  @Get('filtered')
  filter(@Query() query: FilterFields) {
    return this.singerService.filter(query);
  }

  @HttpCode(200)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.singerService.getById(id);
  }

  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/singers',
        filename: fileUpload,
      }),
    }),
  )
  @Post()
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  create(@Body() body: CreateSingerDto, @UploadedFile() image: any) {
    return this.singerService.create({ ...body, image: image.path });
  }

  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/singers',
        filename: fileUpload,
      }),
    }),
  )
  @Patch(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  update(
    @Body() body: UpdateSingerDto,
    @UploadedFile() image: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.singerService.update(id, {
      ...body,
      ...(image && { image: image.path }),
    });
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.singerService.delete(id);
  }
}
