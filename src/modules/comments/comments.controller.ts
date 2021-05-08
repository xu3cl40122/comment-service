import { CommentsService } from './comments.service';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Get()
  async queryComments(@Query() query): Promise<Object> {
    return await this.commentsService.findComments(query);
  }

  @Get('/:comment_id')
  async getCommentById(@Param('comment_id') comment_id): Promise<Object> {
    let comment = await this.commentsService.findCommentById(comment_id);
    if (!comment)
      throw new HttpException('comment not found', HttpStatus.BAD_REQUEST)
    return comment
  }

  @Put('/:comment_id')
  async updateComment(@Param('comment_id') comment_id, @Body() body): Promise<Object> {
    let comment = await this.commentsService.findCommentById(comment_id);
    if (!comment)
      throw new HttpException('comment not found', HttpStatus.BAD_REQUEST)
    return await this.commentsService.updateComment(comment_id, body);
  }

  @Delete('/:comment_id')
  async deleteComment(@Param('comment_id') comment_id,): Promise<Object> {
    return await this.commentsService.deleteComment(comment_id);
  }

  @Post()
  async addComment(@Body() body): Promise<Object> {
    return await this.commentsService.addComment(body);
  }

  @Post('/:comment_id/reply')
  async addReply(@Param('comment_id') comment_id, @Body() body): Promise<Object> {
    return await this.commentsService.addReply(comment_id, body)
      .catch(err => {
        if (err.kind === 'ObjectId')
          throw new HttpException('comment not found', HttpStatus.BAD_REQUEST)
        throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR)
      })
  }

  @Put('/:comment_id/reply/:reply_id')
  async updateReply(@Param('comment_id') comment_id, @Param('reply_id') reply_id, @Body() body): Promise<Object> {
    return await this.commentsService.updateReply(comment_id, reply_id, body).catch(err => {
      if (err.kind === 'ObjectId')
        throw new HttpException('reply not found', HttpStatus.BAD_REQUEST)
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }

}
