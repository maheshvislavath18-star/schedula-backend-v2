export class CreateAppointmentDto {
  doctorId: number;
  patientId: number;
  date: string;
  startTime: string;
  endTime: string;
}