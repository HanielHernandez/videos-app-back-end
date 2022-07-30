import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  signup(@Body() body: AuthDto) {
    return this.auth.singUp(body);
  }

  @Post('signin')
  signin(@Body() body: AuthDto) {
    return this.auth.singIn(body);
  }
}
