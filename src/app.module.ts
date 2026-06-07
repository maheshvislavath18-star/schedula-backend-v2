import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'BUNNY123',
      database: 'schedula',

      // IMPORTANT
      autoLoadEntities: true,
      synchronize: true,
    }),

    UsersModule,
    AuthModule,
    DoctorModule,
    PatientModule,
  ],
})
export class AppModule {}