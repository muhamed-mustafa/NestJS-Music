import {
  Controller,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AcceptedAuthGuard } from 'src/common/guards/accepted-auth.guard';
import { Role } from '../../../common/enums/role.enum';
import { Roles } from '../../../common/decorators/role-decorator';
import { ChatService } from './chat.service';
import { getAuthenticatedUser } from 'src/common/decorators/authenticated-user-decorator';
import { User } from '../../../modules/user/entities/user.entity';
import { Post, Body } from '@nestjs/common';
import { RoomDto } from './dtos/room.dto';
import { Patch, Delete } from '@nestjs/common/decorators';

@UseGuards(AuthGuard(), AcceptedAuthGuard)
@Roles([Role.USER])
@Controller('chat/rooms')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  getAllRooms() {
    return this.chatService.getAllRooms();
  }

  @Get(':id')
  getRoomById(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getRoomById(id);
  }

  @Get('user-rooms')
  getUserRooms(@getAuthenticatedUser() user: User) {
    return this.chatService.getUserRooms(user);
  }

  @Post()
  createNewRoom(
    @getAuthenticatedUser() user: User,
    @Body() createRoomDto: RoomDto,
  ) {
    return this.chatService.createNewRoom(user, createRoomDto);
  }

  @Patch(':id')
  updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: RoomDto,
  ) {
    return this.chatService.updateRoom(id, updateRoomDto);
  }

  @Delete(':id')
  deleteRoom(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.deleteRoom(id);
  }
}
