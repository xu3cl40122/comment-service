import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @Prop()
  target_id: string;

  @Prop()
  content: string;

  @Prop()
  rank: number;

  @Prop()
  created_by: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);