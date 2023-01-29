import { Inject, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UserService } from '../../../modules/user/user.service';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { Socket } from 'socket.io';
import { UserJoinedRoom } from './entities/user-joined-room.entity';
import { User } from '../../../modules/user/entities/user.entity';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(UserJoinedRoom)
    private readonly userJoinedRoom: Repository<UserJoinedRoom>,
  ) {}

  @WebSocketServer() server: Socket;

  private users = 0;

  async handleConnection() {
    this.users++;
    this.server.emit('number-of-connected-users', this.users);
  }

  async handleDisconnect(client: Socket) {
    this.users--;
    this.server.emit('number-of-connected-users', this.users);

    if (client && client.id) {
      const user = await this.userService.findUser({ clientId: client.id });
      if (user)
        client.emit('users-changes', {
          user: user.username,
          event: 'left',
        });
    }
  }

  @SubscribeMessage('enter-chat-room')
  async enterChatRoom(
    client: Socket,
    { nickname, roomId }: { nickname: string; roomId: number },
  ) {
    const user = await this.userService.findUser({ nickname });

    if (!user.clientId) {
      user.clientId = client.id;
      await user.save();
    }

    const room = await this.chatService.getRoomById(roomId);

    const isUserJoined = () =>
      user.userJoinedRooms.some(
        (userJoinedRoom) => userJoinedRoom.roomId === roomId,
      );

    if (!isUserJoined) {
      await this.userJoinedRoom.save(
        this.userJoinedRoom.create({
          user,
          room,
          joinedUsername: user.username,
        }),
      );
    }

    client.join(String(roomId));
    client.broadcast
      .to(String(roomId))
      .emit('users-changes', { user: user.username, event: 'joined' });
  }

  @SubscribeMessage('leave-room')
  async leaveRoom(
    client: Socket,
    { nickname, roomId }: { nickname: string; roomId: number },
  ) {
    const user = await this.userService.findUser({ nickname });

    client.broadcast
      .to(String(roomId))
      .emit('users-changes', { user: user.username, event: 'left' });
    client.leave(String(roomId));
  }

  @SubscribeMessage('send-message')
  async sendMessage(
    client: Socket,
    { text, roomId, userId }: { text: string; roomId: number; userId: number },
  ) {
    const user = await this.userService.findOne(userId);
    const room = await this.chatService.getRoomById(roomId);
    const message = await this.createMessage({ user, room, text });
    client.emit('message', message);
  }

  async createMessage({
    user,
    room,
    text,
  }: {
    user: User;
    room: Room;
    text: string;
  }): Promise<Message> {
    return await this.messageRepository.save(
      this.messageRepository.create({
        text,
        user,
        sender: user.username,
        room,
        roomName: room.name,
      }),
    );
  }
}
