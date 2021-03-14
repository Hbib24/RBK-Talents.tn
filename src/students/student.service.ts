import { Student, StudentDocument } from './student.model';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async create(data: any) {
    const student = new this.studentModel(data);
    let promise = await student.save();
    return promise;
  }

  async edit(id: string, data: any) {
    try {
      const promise = await this.studentModel.findByIdAndUpdate(id, data);
      const newStudent = await this.studentModel.findById(id);

      return newStudent;
    } catch (e) {
      return e;
    }
  }

  async get(page: any, query: any) {
    const offset = (page - 1) * 8;

    let students = await this.studentModel.find(query).skip(offset).limit(8);

    let count = await this.studentModel.countDocuments(query);

    return { items: students, count: count };
  }

  async destroy(id: string) {
    let promise = await this.studentModel.findByIdAndDelete(id);
    return promise;
  }
}
