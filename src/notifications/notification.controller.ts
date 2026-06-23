import {
  Controller,
  Get,
  Patch,
  Param,
} from '@nestjs/common';

import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  getNotifications() {
    return this.notificationService.findAll();
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(Number(id));
  }

  @Patch('read-all')
  markAllRead() {
    return this.notificationService.markAllRead();
  }

  @Get('unread-count')
  getUnreadCount() {
    return this.notificationService.getUnreadCount();
  }
}