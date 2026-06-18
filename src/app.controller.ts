import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  home() {
    return {
      status: 'success',
      project: 'Schedula Backend V2',
      message: 'Schedula Backend API Running Successfully',
    };
  }
}