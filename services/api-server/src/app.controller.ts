import { Controller, Get, Req, Post, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('playbooks')
  listPlaybooks() {
    return this.appService.listPlaybooks();
  }

  @UseGuards(JwtAuthGuard)
  @Post('playbooks/execute')
  executePlaybook(@Body('name') name: string) {
    return this.appService.executePlaybook(name);
  }
} 