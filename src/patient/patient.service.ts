import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PatientProfile } from './entities/patient-profile.entity';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientProfile)
    private patientRepository: Repository<PatientProfile>,
  ) {}

  // CREATE profile
  async createProfile(dto: CreatePatientProfileDto, user: any) {
    const existing = await this.patientRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (existing) {
      return { message: 'Patient profile already exists' };
    }

    const profile = this.patientRepository.create({
      ...dto,
      user,
    });

    return await this.patientRepository.save(profile);
  }

  // GET profiles
  async getProfile() {
    return await this.patientRepository.find({
      relations: {
        user: true,
      },
    });
  }

  // UPDATE profile
  async updateProfile(id: number, dto: Partial<CreatePatientProfileDto>) {
    const profile = await this.patientRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Patient profile not found');
    }

    Object.assign(profile, dto);

    return await this.patientRepository.save(profile);
  }
}