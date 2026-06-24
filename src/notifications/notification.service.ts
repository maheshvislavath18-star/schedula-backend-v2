import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(data: {
    patientId: number;
    title: string;
    message: string;
    type: any;
  }) {
    const notification =
      this.notificationRepository.create({
        patientId: data.patientId,
        title: data.title,
        message: data.message,
        type: data.type,
      });

    return this.notificationRepository.save(notification);
  }

  async findAll() {
    return this.notificationRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async markAsRead(id: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      return {
        message: 'Notification not found',
      };
    }

    if (notification.isRead) {
      return {
        message: 'Notification already marked as read',
      };
    }

    notification.isRead = true;

    await this.notificationRepository.save(notification);

    return {
      message: 'Notification marked as read',
    };
  }

  async markAllRead() {
    await this.notificationRepository.update(
      { isRead: false },
      { isRead: true },
    );

    return {
      message: 'All notifications marked as read',
    };
  }

  async getUnreadCount() {
    const count = await this.notificationRepository.count({
      where: {
        isRead: false,
      },
    });

    return {
      unreadCount: count,
    };
  }
}