import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect()
  gotoAuth() {
    return {
      url: '/signin',
      statusCode: 301,
    };
  }
}
