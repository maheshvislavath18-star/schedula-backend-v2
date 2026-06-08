import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // TEMP signup (no DB yet)
  signup(data: any) {
    return {
      message: 'User registered successfully',
      data,
    };
  }

  // LOGIN (FIXED)
  login(data: any) {
    // ⚠️ In real project you will verify DB user here
    if (!data.username || !data.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Fake user (until DB auth is added)
    const user = {
      id: 1,
      username: data.username,
      role: 'DOCTOR', // later replace with DB role
    };

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}