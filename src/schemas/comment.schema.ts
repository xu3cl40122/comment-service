import { Prop, Schema, SchemaFactory, raw, } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'
import { ApiProperty } from '@nestjs/swagger';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Comment {
  @ApiProperty()
  _id: string

  @Prop()
  @ApiProperty()
  target_id: string;

  @Prop()
  @ApiProperty()
  content: string;

  @Prop()
  @ApiProperty()
  rank: number;

  @Prop(raw([{
    content: { type: String },
    creator_id: { type: String },
    creator_display_name: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  }]))
  @ApiProperty({
    example:[{
      "_id": "60b20b86d583140227ef642e",
      "content": "test3",
      "creator_display_name": "creator_display_name",
      "creator_id": "ec27f218-1f68-46e6-bc4d-d12b34c21fdf",
      "created_at": "2021-05-29T09:38:14.226Z",
      "updated_at": "2021-05-29T09:38:14.226Z"
    }]
  })
  replies: Reply[];

  @Prop()
  @ApiProperty()
  creator_id: string;

  @Prop()
  @ApiProperty()
  creator_display_name: string;

  @Prop()
  @ApiProperty({
    description: '因為 creator_id 如果是 integer 很容易衝突，需要 tag 來區別是在評論什麼',
    example: 'gc-court'
  })
  tag: string;

  @Prop({ type: Date, default: Date.now })
  @ApiProperty()
  edited_at: Date;

  @Prop({ default: false })
  @ApiProperty()
  deleted: boolean;

}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export class Reply {
  _id: string;
  content: string;
  creator_id: string;
  creator_display_name: string;
  created_at: Date;
  updated_at: Date;
}