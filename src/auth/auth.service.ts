
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  signup(data: any) {
    const { email, password, role } = data;

    return {
      message: 'User registered successfully',
      data: {
        email,
        role: role || 'DOCTOR',
      },
    };
  }

  login(data: any) {
    const { email, password } = data;

    if (!email || !password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = {
      id: 1,
      email,
      role: 'DOCTOR',
    };

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}