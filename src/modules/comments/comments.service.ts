import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument, Reply } from '../../schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) { }

  async addComment(body: Comment): Promise<Comment> {
    const comment = new this.commentModel(body);
    return comment.save();
  }

  // 加 { new: true } 才會 return updated document
  async updateComment(comment_id: string, body: Comment): Promise<Comment> {
    return this.commentModel.findByIdAndUpdate(comment_id, {
      $set: {
        content: body.content,
        rank: body.rank,
        edited_at: new Date()
      }
    }, { new: true })
  }

  async deleteComment(comment_id: string): Promise<Comment> {
    return this.commentModel.findByIdAndUpdate(comment_id, {
      $set: {
        deleted: true
      }
    }, { new: true })
  }

  async findComments(query: { page?, size?, target_id?: string, created_by?: string }): Promise<Object> {
    let [page, size] = [Number(query.page ?? 0), Number(query.size ?? 10)]

    let { target_id, created_by } = query
    let where: any = {
      deleted: false
    }
    if (target_id)
      where.target_id = target_id
    if (created_by)
      where.created_by = created_by

    let [content, total] = await Promise.all([
      this.commentModel.find(where, null, {
        limit: size,
        skip: page * size,
      }).exec(),
      this.commentModel.countDocuments(where)
    ])

    let totalPage = Math.ceil(total / size)

    return {
      content,
      page,
      size,
      total,
      totalPage
    }
  }

  async findCommentById(comment_id: string): Promise<Comment> {
    return this.commentModel.findById(comment_id)
  }

  async addReply(comment_id: string, body: Reply): Promise<Comment> {
    return this.commentModel.findByIdAndUpdate(comment_id, { $push: { replies: body } }, { new: true })
  }

  async updateReply(comment_id: string, reply_id: string, body: Reply): Promise<Object> {
    return this.commentModel.updateOne(
      { _id: comment_id, "replies._id": reply_id },
      { $set: { 'replies.$.content': body.content, 'replies.$.updated_at': new Date() } },
      { new: true }
    )
  }
}
