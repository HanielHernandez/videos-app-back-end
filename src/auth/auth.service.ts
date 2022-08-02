import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/singup.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async singUp(dto: SignUpDto): Promise<User> {
    try {
      const password = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password,
        },
      });

      delete user.password;
      return user;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        if (e.code == 'P2002') {
          throw new ForbiddenException('EMAIL_ALREADY_EXIST');
        }
      throw e;
    }
  }

  async singIn(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new ForbiddenException('INVALID_CREDENTIALS');
      }
      const pwMatches = await argon.verify(user.password, dto.password);

      if (!pwMatches) {
        throw new ForbiddenException('INVALID_CREDENTIALS');
      }
      delete user.password;
      const accessToken = await this.createToken({
        id: user.id,
        email: user.email,
      });
      return {
        user,
        accessToken,
      };
    } catch (e) {
      throw e;
    }
  }

  createToken(payload: { id: number; email: string }) {
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(payload, {
      expiresIn: '1w',
      secret,
    });
  }
}
