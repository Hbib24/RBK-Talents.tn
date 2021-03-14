import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  Types,
  Schema as MongooseSchema,
  PromiseProvider,
} from 'mongoose';

export type StudentDocument = Student & Document;

@Schema()
export class Student extends Document {
  @Prop({ index: true })
  fullName: string;

  @Prop({ index: true })
  firstName: string;

  @Prop({ index: true })
  lastName: string;

  @Prop({ index: true })
  email: string;

  @Prop()
  imageUrl: string;

  @Prop({ index: true })
  cohort: string;

  @Prop()
  resume: string;

  @Prop({ default: new Date() })
  dateAdded: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
