import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Put,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

@Controller('/api/student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Post('/new')
  @UseInterceptors(FileInterceptor('resume'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    var fs = require('fs');

    fs.rename(
      join(__dirname, '..', '..', file.path),
      join(__dirname, '..', '..', file.path + '.pdf'),
      (err) => console.log(err),
    );

    const { filename } = file;

    req.body.resume = '/upload/' + filename + '.pdf';
    req.body.fullName = req.body.firstName + ' ' + req.body.lastName;

    this.studentService
      .create(req.body)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  @Get('/:page')
  getAll(@Res() res: Response, @Req() req: Request) {
    const { search } = req.query;
    const { page } = req.params;

    if (search) {
      function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      }
      const regex = new RegExp(escapeRegex(search), 'gi');

      this.studentService
        .get(parseInt(page), {
          $or: [{ fullName: { $regex: regex } }, { cohort: { $regex: regex } }],
        })
        .then((students) => {
          res.status(200).send(students);
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      this.studentService
        .get(parseInt(page), {})
        .then((students) => {
          res.status(200).send(students);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  }

  @Get('/pop/yes')
  populate() {
    const faker = require('faker');
    for (var i = 0; i < 5; i++) {
      let firstName = faker.name.firstName();
      let lastName = faker.name.lastName();
      let obj = {
        fullName: firstName + ' ' + lastName,
        firstName: firstName,
        lastName: lastName,
        email: faker.internet.email(),
        imageUrl: faker.image.people(),
        resume: '/upload/9f2ea0c8a1571d2f961d5106c8a5667d.pdf',
        cohort: 'cohort 9',
      };

      this.studentService.create(obj);
    }
  }

  @Post('/edit/:id')
  @UseInterceptors(FileInterceptor('resume'))
  edit(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { resume: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (file) {
      var fs = require('fs');

      fs.rename(
        join(__dirname, '..', '..', file.path),
        join(__dirname, '..', '..', file.path + '.pdf'),
        (err) => console.log(err),
      );

      const { filename } = file;

      body.resume = '/upload/' + filename + '.pdf';
    }

    this.studentService
      .edit(req.params.id, body)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  @Delete('/delete/:id')
  destroy(@Res() res: Response, @Req() req: Request) {
    this.studentService
      .destroy(req.params.id)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  }
}
