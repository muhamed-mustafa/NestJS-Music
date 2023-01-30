import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Subscriber } from './entities/subscriber.entity';
import { SubscribersNotifications } from './entities/subscribers-notifications.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../common/constants/auth-constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      Subscriber,
      SubscribersNotifications,
    ]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
