import { Injectable, NotFoundException } from '@nestjs/common';
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

  async createProfile(dto: CreateDoctorProfileDto, user: any) {
    console.log('========== CREATE PROFILE ==========');
    console.log('USER:', user);
    console.log('DTO:', dto);

    return {
      message: 'Debug working',
      user,
      dto,
    };
  }

  async getProfile() {
    return await this.doctorRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async updateProfile(id: number, dto: Partial<CreateDoctorProfileDto>) {
    const profile = await this.doctorRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    Object.assign(profile, dto);

    return await this.doctorRepository.save(profile);
  }
}