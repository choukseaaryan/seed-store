import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dto';
import type { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { accessToken, user } = await this.authService.login(loginDto);
    
    // Set HTTP-only cookie with the access token
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return { user };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Returns current user info' })
  async getCurrentUser(@Req() request: Request) {
    return this.authService.getCurrentUser(request);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}
