import {
Controller,
Get,
Post,
Patch,
Body,
Param,
Query,
UseGuards,
Req,
ForbiddenException,
ParseIntPipe,
} from '@nestjs/common';

import { DoctorService } from './doctor.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { GetSlotsDto } from './dto/get-slots.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('doctor')
export class DoctorController {
constructor(private readonly doctorService: DoctorService) {}

// TEST JWT
@UseGuards(JwtAuthGuard)
@Post('test')
test(@Req() req) {
return req.user;
}

// CREATE PROFILE
@UseGuards(JwtAuthGuard)
@Post('profile')
createProfile(@Body() dto: CreateDoctorProfileDto, @Req() req) {


return this.doctorService.createProfile(dto, req.user);


}

// GET PROFILE
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Req() req) {
if (!req.user?.id) {
throw new ForbiddenException('Invalid token');
}


if (req.user.role !== 'DOCTOR') {
  throw new ForbiddenException('Only doctors can view profile');
}

return this.doctorService.getProfile(req.user.id);


}

// UPDATE PROFILE
@UseGuards(JwtAuthGuard)
@Patch('profile/:id')
updateProfile(
@Param('id') id: string,
@Body() dto: CreateDoctorProfileDto,
@Req() req,
) {
if (!req.user?.id) {
throw new ForbiddenException('Invalid token');
}


if (req.user.role !== 'DOCTOR') {
  throw new ForbiddenException('Only doctors can update profile');
}

return this.doctorService.updateProfile(Number(id), dto);

}

// DAY 12 - VIEW APPOINTMENTS
//@UseGuards(JwtAuthGuard)
@Get('appointments')
getAppointments(
@Req() req,
@Query('date') date?: string,
) {
return this.doctorService.getAppointments(
1,
date,
);
}


// DAY 12 - CANCEL APPOINTMENT
//@UseGuards(JwtAuthGuard)
@Patch('appointments/:id/cancel')
cancelAppointment(
@Param('id', ParseIntPipe) id: number,
) {
return this.doctorService.cancelAppointment(
id,
1,
);
}


// DAY 7 - GET AVAILABLE SLOTS
@UseGuards(JwtAuthGuard)
@Get(':doctorId/slots')
getSlots(
@Param('doctorId') doctorId: string,
@Query() query: GetSlotsDto,
) {
return this.doctorService.getSlots(
Number(doctorId),
query.date,
);
}
}
