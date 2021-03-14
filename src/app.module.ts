import { UserService } from './users/user.service';
import { UserController } from './users/user.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/user.model';
import { StudentController } from './students/student.controller';
import { StudentService } from './students/student.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { from } from 'rxjs';
import { Student, StudentSchema } from './students/student.model';
require('dotenv').config();

@Module({
  controllers: [UserController, StudentController],
  providers: [UserService, StudentService],
  imports: [
    MongooseModule.forRoot(process.env.DB_URI, {
      useFindAndModify: false,
      useCreateIndex: true,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    MulterModule.register({
      dest: './client/build/upload',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'build'),
    }),
  ],
})
export class AppModule {}
