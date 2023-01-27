import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Role } from '../../common/enums/role.enum';
import {
  Get,
  Body,
  HttpCode,
  UseGuards,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Roles } from '../../common/decorators/role-decorator';
import { AuthGuard } from '@nestjs/passport';
import { DeleteResult } from 'typeorm';
import { AcceptedAuthGuard } from '../../common/guards/accepted-auth.guard';
import { getAuthenticatedUser } from '../../common/decorators/authenticated-user-decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @Get('current-user')
  @UseGuards(AuthGuard(), AcceptedAuthGuard)
  @Roles([Role.USER, Role.ADMIN])
  async getCurrentUser(@getAuthenticatedUser() user: User) {
    return await this.userService.getCurrentUser(user);
  }

  @HttpCode(200)
  @Get()
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  async find() {
    return await this.userService.find();
  }

  @HttpCode(200)
  @Get(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  deleteById(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.userService.delete(id);
  }

  @HttpCode(200)
  @Patch('edit-role/:id')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  editRole(@Param('id', ParseIntPipe) id: number, @Body('role') role: Role) {
    return this.userService.editRole(id, role);
  }
}
