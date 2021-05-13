import { Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
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
        tag: body.tag,
        creator_display_name: body.creator_display_name,
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

  async findComments(query: { page?, size?, target_id?: string, tag?: string, creator_id?: string }): Promise<Object> {
    let [page, size] = [Number(query.page ?? 0), Number(query.size ?? 10)]

    let { target_id, creator_id, tag } = query
    let where: any = {
      deleted: false
    }
    if (target_id)
      where.target_id = target_id
    if (creator_id)
      where.creator_id = creator_id
    if (tag)
      where.tag = tag

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

  async getStatistics(query: { target_id?: string, tag?: string, }): Promise<Object> {
    let { target_id, tag } = query
    let condition: any = { 'deleted': false }
    if (target_id)
      condition['target_id'] = target_id
    if (tag)
      condition['tag'] = tag
    let total = await this.commentModel.countDocuments(condition)
    let resArr = await this.commentModel.aggregate(
      [
        { "$match": condition },
        {
          $group:
          {
            "_id": "_id",
            avg_rank: { $avg: "$rank" },
          }

        }
      ]
    )

    await Promise.all([resArr, total])
    return {
      total,
      avgRank: resArr?.[0]?.avg_rank ?? ''
    }
  }

  async findReplyById(comment_id: string, reply_id: string): Promise<Reply> {
    let comment = await this.commentModel.findOne({ _id: comment_id, 'replies._id': reply_id })
    let reply = comment.replies.find(d => d._id.toString() === reply_id)
    return reply
  }

  async addReply(comment_id: string, body: Reply): Promise<Comment> {
    return this.commentModel.findByIdAndUpdate(comment_id, { $push: { replies: body } }, { new: true })
  }

  async updateReply(comment_id: string, reply_id: string, body: Reply): Promise<Object> {
    return this.commentModel.updateOne(
      { _id: comment_id, "replies._id": reply_id },
      {
        $set: {
          'replies.$.content': body.content,
          'replies.$.creator_display_name': body.creator_display_name,
          'replies.$.updated_at': new Date(),
        }
      },
      { new: true }
    )
  }

  async deleteReply(comment_id: string, reply_id: string): Promise<Object> {
    return this.commentModel.updateOne(
      { _id: comment_id, },
      { $pull: { 'replies': { '_id': reply_id } } }
    )
  }
}
