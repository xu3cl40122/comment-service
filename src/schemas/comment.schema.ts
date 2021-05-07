import { Prop, Schema, SchemaFactory, raw, } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'

export type CommentDocument = Comment & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Comment {
  @Prop()
  target_id: string;

  @Prop()
  content: string;

  @Prop()
  rank: number;

  @Prop(raw([{
    content: { type: String },
    created_by: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  }]))
  replies: Reply[];

  @Prop()
  created_by: string;

  @Prop({ type: Date, default: Date.now })
  edited_at: Date;

  @Prop({ default: false })
  deleted: boolean;

}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export class Reply {
  _id: string;
  content: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}