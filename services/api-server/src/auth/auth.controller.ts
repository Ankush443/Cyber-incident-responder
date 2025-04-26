import { Controller, Post, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    // For demo purposes, we're using hardcoded credentials
    if (loginDto.username === 'admin' && loginDto.password === 'admin') {
      // Generate JWT token
      const payload = { username: loginDto.username, sub: '1', role: 'admin' };
      return {
        username: loginDto.username,
        role: 'admin',
        token: this.jwtService.sign(payload)
      };
    }
    
    // Return 401 Unauthorized
    throw new Error('Invalid credentials');
  }
} 