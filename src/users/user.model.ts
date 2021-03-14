import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: ['admin', 'company'], default: 'company' })
  role: string;

  @Prop({})
  imageUrl: string;

  @Prop({
    required: true,
    enum: ['PENDING', 'ACTIVE', 'RESTRICTED'],
    default: 'PENDING',
  })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
