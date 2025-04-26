import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WsGateway } from './ws.gateway';
import { PrismaService } from './prisma.service';
import { ActionsController } from './actions.controller';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretjwt',
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [AppController, ActionsController, AuthController],
  providers: [AppService, WsGateway, PrismaService]
})
export class AppModule {} 