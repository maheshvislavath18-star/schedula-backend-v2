export class CreateAvailabilityDto {
  dayOfWeek!: string;
  startTime!: string;
  endTime!: string;

  allowFutureBooking!: boolean;

  maxFutureBookingDays?: number;
}