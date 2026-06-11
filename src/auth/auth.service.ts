import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // SIGNUP (TEMP - no DB yet)
  signup(data: any) {
    const { email, password } = data;

    return {
      message: 'User registered successfully',
      data: {
        email,
      },
    };
  }

  // LOGIN
  login(data: any) {
    const { username, password } = data;

    if (!username || !password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = {
      id: 1,
      username,
      role: 'DOCTOR',
    };

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      message: 'Login successful',

      // ✅ IMPORTANT FIX (safer JWT handling)
      access_token: this.jwtService.sign(payload),

      user,
    };
  }
}