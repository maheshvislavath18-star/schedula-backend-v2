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

  // CREATE PROFILE
  async createProfile(dto: CreateDoctorProfileDto, user: any) {
    console.log('USER:', user);
    console.log('DTO:', dto);

    const profile = this.doctorRepository.create({
      ...dto,
      user: { id: user.id }, // ✅ FIXED (important for TypeORM relation)
    });

    const saved = await this.doctorRepository.save(profile);

    return {
      message: 'Doctor profile created successfully',
      data: saved,
    };
  }

  // GET PROFILE
  async getProfile(userId: number) {
    const profile = await this.doctorRepository.findOne({
      where: {
        user: { id: userId },
      },
      relations: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    return {
      message: 'Doctor profile fetched successfully',
      data: profile,
    };
  }

  // UPDATE PROFILE
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

    const updated = await this.doctorRepository.save(profile);

    return {
      message: 'Doctor profile updated successfully',
      data: updated,
    };
  }
}