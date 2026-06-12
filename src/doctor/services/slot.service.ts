import { Injectable } from '@nestjs/common';

@Injectable()
export class SlotService {
  async getAvailableSlots(
    doctorId: number,
    date: string,
  ) {
    // Day 7 logic here
  }
}