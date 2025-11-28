import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ required: true })
    companyName: string;

    @Prop({ required: true })
    companyUrl: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 'staff' })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
