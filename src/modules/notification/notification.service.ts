import { Injectable, NotFoundException } from '@nestjs/common';
import * as webPush from 'web-push';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { Repository } from 'typeorm';
import { SubscribersNotifications } from './entities/subscribers-notifications.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { NotificationPayload } from './classes/notification-payload';
import { Notification } from './classes/notification';
import { NotificationData } from './classes/notification-data';
import { NotificationEntity } from './entities/notification.entity';
import { v4 as uuidv4 } from 'uuid';
import { NotificationPayloadDto } from './dtos/notification-payload.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Subscriber)
    private subscriberRepository: Repository<Subscriber>,
    @InjectRepository(SubscribersNotifications)
    private subscribersNotificationsRepository: Repository<SubscribersNotifications>,
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}

  async getAllSubscribers(): Promise<Subscriber[]> {
    return await this.subscriberRepository.find();
  }

  async getSubscriber(id: number): Promise<Subscriber> {
    const subscriber = await this.subscriberRepository.findOne({
      where: {
        id,
      },
    });

    if (!subscriber) {
      throw new NotFoundException(`Subscriber with Id ${id}  not found`);
    }
    return subscriber;
  }

  async getSubscriberNotifications(
    id: number,
  ): Promise<SubscribersNotifications[]> {
    const subscriber = await this.getSubscriber(id);
    return subscriber.subscribersNotifications;
  }

  async deleteSubscriber(id: number): Promise<void> {
    const subscriber = await this.getSubscriber(id);

    await Promise.all([
      subscriber.subscribersNotifications.map(async (subscriber) => {
        await this.subscribersNotificationsRepository.delete(subscriber.id);
      }),

      await this.subscriberRepository.delete(id),
    ]);
  }

  async newSubscriber(user: User, subscriber: Subscriber): Promise<Subscriber> {
    const { endpoint, expirationTime, keys } = subscriber;

    return await this.subscriberRepository.save(
      this.subscriberRepository.create({
        user,
        keys,
        endpoint,
        expirationTime,
        subscribersNotifications: [],
      }),
    );
  }

  async sendNewNotification({ body, title }: NotificationPayloadDto) {
    const notificationPayload = new NotificationPayload();

    notificationPayload.notification = new Notification();
    notificationPayload.notification.title = title;
    notificationPayload.notification.body = body;
    notificationPayload.notification.actions = [
      {
        action: 'explore',
        title: 'explore my new website',
      },
      {
        action: 'explore',
        title: 'Close Popups',
      },
    ];

    notificationPayload.notification.data = new NotificationData();
    notificationPayload.notification.data.dateOfArrival = new Date(Date.now());
    notificationPayload.notification.data.primaryKey = uuidv4();
    notificationPayload.notification.icon =
      'https://songs-static.s3.us-east-2.amazonaws.com/main-page-logo-small-hat.png';
    notificationPayload.notification.vibrate = [100, 50, 100];

    const subscribers = await this.getAllSubscribers();
    const notification = await this.createNotification({ title, body });

    subscribers.map(async (subscriber) => {
      await this.createSubscriberNotification(
        notificationPayload,
        notification,
        subscriber,
      );

      await webPush.sendNotification(
        subscriber,
        JSON.stringify(notificationPayload),
      );
    });
  }

  async createSubscriberNotification(
    notificationPayload: NotificationPayload,
    notification: NotificationEntity,
    subscriber: Subscriber,
  ): Promise<SubscribersNotifications> {
    return await this.subscribersNotificationsRepository.save(
      this.subscribersNotificationsRepository.create({
        title: notificationPayload.notification.title,
        body: notificationPayload.notification.body,
        data: notificationPayload.notification.data,
        actions: notificationPayload.notification.actions,
        vibrate: notificationPayload.notification.vibrate,
        subscriber,
        notification,
      }),
    );
  }

  async createNotification({
    body,
    title,
  }: NotificationPayloadDto): Promise<NotificationEntity> {
    return await this.notificationRepository.save(
      this.notificationRepository.create({
        title,
        body,
        subscribersNotifications: [],
      }),
    );
  }
}
