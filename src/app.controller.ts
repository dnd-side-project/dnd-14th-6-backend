import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck(): boolean {
    return true;
  }

  @Post('exception-test')
  errorTest(@Body() body: { type: string }) {
    if (body.type === 'http') {
      throw new BadRequestException('Bad Request');
    }

    if (body.type === 'type') {
      throw new TypeError('Type error test');
    }

    throw new Error('common error');
  }
}
