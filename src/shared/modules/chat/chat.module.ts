import { Module, forwardRef } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Message } from './entities/message.entity';
import { UserJoinedRoom } from './entities/user-joined-room.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../../common/constants/auth-constants';
import { UserModule } from '../../../modules/user/user.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Message, UserJoinedRoom]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
