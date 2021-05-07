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
    return await this.commentsService.findComments();
  }

  @Get('/:comment_id')
  async getCommentById(@Param('comment_id') comment_id): Promise<Object> {
    return await this.commentsService.findCommentById(comment_id);
  }

  @Put('/:comment_id')
  async updateComment(@Param('comment_id') comment_id, @Body() body): Promise<Object> {
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
    return await this.commentsService.addReply(comment_id, body);
  }

  @Put('/:comment_id/reply/:reply_id')
  async updateReply(@Param('comment_id') comment_id, @Param('reply_id') reply_id, @Body() body): Promise<Object> {
    return await this.commentsService.updateReply(comment_id, reply_id, body);
  }

}
