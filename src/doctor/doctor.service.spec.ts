import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DoctorProfile } from './entities/doctor-profile.entity';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorProfile)
    private doctorRepository: Repository<DoctorProfile>,
  ) {}

  async createProfile(dto: CreateDoctorProfileDto) {
    const profile = this.doctorRepository.create(dto);
    return this.doctorRepository.save(profile);
  }

  async getProfile() {
    return this.doctorRepository.find();
  }
}