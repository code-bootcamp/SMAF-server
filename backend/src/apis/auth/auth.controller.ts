import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/users.entity';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

interface IOAuthUser {
  user: Pick<User, 'email' | 'password' | 'userName'>;
}

@Controller('/')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    const user = await this.userService.findEmail({ email: req.user.email });

    if (!user) {
      const { password, ...rest } = req.user;
      const hashedPassword = await bcrypt.hash(req.user.password, 10);
      const createUserInput = { ...rest, password: hashedPassword };

      const newUser = await this.userService.create({ createUserInput });
    }

    this.authService.setRefreshToken({ user, res });
    res.redirect('http://localhost:3000/graphql');
  }

  @Get('login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    const user = await this.userService.findEmail({ email: req.user.email });

    if (!user) {
      const { password, ...rest } = req.user;
      const hashedPassword = await bcrypt.hash(req.user.password, 10);
      const createUserInput = { ...rest, password: hashedPassword };

      const newUser = await this.userService.create({ createUserInput });
    }

    this.authService.setRefreshToken({ user, res });
    res.redirect('http://localhost:3000/graphql');
  }

  @Get('login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    const user = await this.userService.findEmail({ email: req.user.email });

    if (!user) {
      const { password, ...rest } = req.user;
      const hashedPassword = await bcrypt.hash(req.user.password, 10);
      const createUserInput = { ...rest, password: hashedPassword };

      const newUser = await this.userService.create({ createUserInput });
    }

    this.authService.setRefreshToken({ user, res });
    res.redirect(
      'http://localhost:5500/f6b2-team5-server/frontend/login/index.html',
    );
  }
}