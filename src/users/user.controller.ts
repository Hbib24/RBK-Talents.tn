import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Put,
  Param,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import * as bcrypt from 'bcrypt';
require('dotenv').config();

@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/new')
  async create(@Body() body: UserDto, @Res() res: Response) {
    const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rbktalents.tn@gmail.com',
        pass: process.env.EMAIL,
      },
    });

    this.userService
      .create(body)
      .then((user) => {
        const token = this.jwtService.sign({
          user_id: user.id,
        });

        transporter.sendMail({
          from: 'rbktalents.tn@gmail.com', // sender address
          to: body.email, // list of receivers
          subject: 'Hello, Please register your account', // Subject line
          html: `click on this <a href="http://localhost:3001/api/user/confirmation/${token}">link</a>`,
        });

        const data = {
          username: user.username,
          role: user.role,
          email: user.email,
          status: user.status,
        };

        res.send(data);
      })

      .catch((err) => {
        res.send({ message: err, saved: false });
      });
  }

  @Get('/confirmation/:token')
  redirectUser(@Param() params, @Res() res: Response) {
    try {
      const { user_id } = this.jwtService.verify(params.token);

      res.redirect('http://localhost:3001/register/' + user_id);
    } catch {
      res.send('access denied');
    }
  }

  @Put('/register/:id')
  async registerUser(
    @Param() params,
    @Body() body: UserDto,
    @Res() res: Response,
  ) {
    const salt = await bcrypt.genSalt(10);

    const hashedPass = await bcrypt.hash(body.password, salt);

    this.userService
      .registerPass(params.id, hashedPass)
      .then((user) => {
        res.send({ saved: true });
      })
      .catch((err) => res.send({ error: err, saved: false }));
  }

  @Post('/login')
  login(@Body() body: UserDto, @Res() res: Response, @Req() req: Request) {
    const { authorization } = req.headers;

    if (authorization) {
      try {
        const { user_id } = this.jwtService.verify(authorization);
        this.userService
          .getOne(user_id)
          .then((result) => {
            res.status(200).send({ user: result });
          })
          .catch((e) => res.send(e));
      } catch (e) {
        res.status(400).send({ err: e });
      }
    } else {
      if (!body.email || !body.password) {
        res.status(400).send({ message: 'missing data' }).end();
      }

      this.userService.login(body).then((result: any) => {
        const authToken = this.jwtService.sign({
          user_id: result._id,
        });
        res.status(200).header({ authToken: authToken }).send({ user: result });
      });
    }
  }

  @Get('/company')
  getCompanies(@Res() res: Response) {
    return this.userService
      .getCompanies()
      .then((companies) => res.status(200).send(companies))
      .catch((err) => res.send(err));
  }
}
