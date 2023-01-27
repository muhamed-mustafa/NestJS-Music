import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/role-decorator';
import { UserGuard } from 'src/common/guards/user.guard';
import { Role } from '../../common/enums/role.enum';

@UseGuards(AuthGuard(), UserGuard)
@Roles([Role.USER])
@Controller('favorites')
export class FavoriteController {
  constructor(private favoriteListService: FavoriteService) {}

  @HttpCode(200)
  @Get(':id')
  getUserFavoriteList(@Param('id', ParseIntPipe) id: number) {
    return this.favoriteListService.getFavoriteList(id);
  }

  @HttpCode(200)
  @Delete('clear/:id')
  clearFavoriteList(@Param('id', ParseIntPipe) id: number) {
    return this.favoriteListService.clearFavoriteList(id);
  }

  @HttpCode(204)
  @Delete(':favoriteId/:trackId')
  removeTrackFromFavoriteList(
    @Param('favoriteId', ParseIntPipe) favoriteId: number,
    @Param('trackId', ParseIntPipe) trackId: number,
  ) {
    return this.favoriteListService.removeTrackFromFavoriteList(
      favoriteId,
      trackId,
    );
  }
}
