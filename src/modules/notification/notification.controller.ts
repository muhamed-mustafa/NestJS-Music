import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notification.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../common/decorators/role-decorator';
import { UserGuard } from '../../common/guards/user.guard';
import { getAuthenticatedUser } from '../../common/decorators/authenticated-user-decorator';
import { User } from '../user/entities/user.entity';
import { AcceptedAuthGuard } from 'src/common/guards/accepted-auth.guard';
import { NotificationPayloadDto } from './dtos/notification-payload.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('subscribers')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  getAllSubscribers() {
    return this.notificationService.getAllSubscribers();
  }

  @Get('subscribers/subscriber-notifications')
  @UseGuards(AuthGuard(), UserGuard)
  @Roles([Role.USER])
  getSubscriberNotifications(@getAuthenticatedUser() user: User) {
    if (user.subscriberId) {
      return this.notificationService.getSubscriberNotifications(
        user.subscriberId,
      );
    } else {
      return null;
    }
  }

  @Get('subscribers/:id')
  @UseGuards(AuthGuard(), AcceptedAuthGuard)
  @Roles([Role.ADMIN, Role.USER])
  getSubscriberById(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.getSubscriber(id);
  }

  @Post('subscribers/new')
  @UseGuards(AuthGuard(), AcceptedAuthGuard)
  @Roles([Role.ADMIN, Role.USER])
  newSubscriber(@getAuthenticatedUser() user: User, @Body() subscriber: any) {
    return this.notificationService.newSubscriber(user, subscriber);
  }

  @Post('send-notification')
  @UseGuards(AuthGuard(), AdminGuard)
  @Roles([Role.ADMIN])
  sendNotification(@Body() notificationPayloadDto: NotificationPayloadDto) {
    return this.notificationService.sendNewNotification(notificationPayloadDto);
  }
}
