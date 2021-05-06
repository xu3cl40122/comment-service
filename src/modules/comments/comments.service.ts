import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../../schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) { }

  async create(comment: Comment): Promise<Comment> {
    const createdCat = new this.commentModel(comment);
    return createdCat.save();
  }

  async findAll(): Promise<Comment[]> {
    return this.commentModel.find().exec();
  }
}
