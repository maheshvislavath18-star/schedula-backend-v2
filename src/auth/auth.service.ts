import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup(data: any) {
    return {
      message: 'User registered successfully',
      data,
    };
  }

  login(data: any) {
    return {
      message: 'Login successful',
      token: 'dummy-jwt-token',
      data,
    };
  }
}