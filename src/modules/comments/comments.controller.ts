import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiOkResponse, ApiCreatedResponse, ApiHeader, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { getManyResponseFor } from '../../methods/spec'
import { Comment } from '../../schemas/comment.schema'
import { CommentQueryDto, StatisticsQueryDto } from '../../dto/query.dto'
import { CreateCommentDto, UpdateCommentDto, CreateReplyDto, UpdateReplyDto } from '../../dto/comment.dto'
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
  @ApiOperation({ summary: '查詢評論' })
  @ApiOkResponse({ type: getManyResponseFor(Comment) })
  async queryComments(@Query() query: CommentQueryDto): Promise<Object> {
    return await this.commentsService.findComments(query);
  }

  @Get('/statistics')
  @ApiOperation({ summary: '查詢 target 評論統計' })
  @ApiOkResponse({
    schema: {
      example: {
        "total": 1,
        "avgRank": 2
      }
    }
  })
  async getStatistics(@Query() query: StatisticsQueryDto): Promise<Object> {
    return await this.commentsService.getStatistics(query);
  }

  @Get('/:comment_id')
  @ApiOperation({ summary: '查詢評論詳細資訊' })
  @ApiOkResponse({ type: Comment })
  async getCommentById(@Param('comment_id') comment_id): Promise<Object> {
    let comment = await this.commentsService.findCommentById(comment_id);
    if (!comment)
      throw new HttpException('comment not found', HttpStatus.BAD_REQUEST)
    return comment
  }

  @Put('/:comment_id')
  @ApiOperation({ summary: '編輯評論' })
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Comment })
  @ApiHeader({ name: 'Authorization', description: 'JWT' })
  async updateComment(@Req() req, @Param('comment_id') comment_id, @Body() body: UpdateCommentDto): Promise<Object> {
    let user_id = req.payload.user_id
    let comment = await this.commentsService.findCommentById(comment_id);
    if (!comment)
      throw new HttpException('comment not found', HttpStatus.BAD_REQUEST)
    if (comment.creator_id !== user_id)
      throw new HttpException('only creater can update', HttpStatus.FORBIDDEN)
    return await this.commentsService.updateComment(comment_id, body);
  }

  @Delete('/:comment_id')
  @ApiOperation({ summary: '刪除評論' })
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async deleteComment(@Req() req, @Param('comment_id') comment_id): Promise<Object> {
    let user_id = req.payload.user_id
    let comment = await this.commentsService.findCommentById(comment_id);
    if (!comment)
      throw new HttpException('comment not found', HttpStatus.BAD_REQUEST)
    if (comment.creator_id !== user_id)
      throw new HttpException('only creater can delete', HttpStatus.FORBIDDEN)
    return await this.commentsService.deleteComment(comment_id);
  }

  @Post()
  @ApiOperation({ summary: '新增評論' })
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: Comment })
  @ApiHeader({ name: 'Authorization', description: 'JWT' })
  async addComment(@Req() req, @Body() body: CreateCommentDto): Promise<Object> {
    let user_id = req.payload.user_id
    body.creator_id = user_id
    return await this.commentsService.addComment(body);
  }

  @Post('/:comment_id/reply')
  @ApiOperation({ summary: '新增回覆' })
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: Comment })
  async addReply(@Req() req, @Param('comment_id') comment_id, @Body() body: CreateReplyDto): Promise<Object> {
    let user_id = req.payload.user_id
    body.creator_id = user_id
    return await this.commentsService.addReply(comment_id, body)
      .catch(err => {
        if (err.kind === 'ObjectId')
          throw new HttpException('comment not found', HttpStatus.BAD_REQUEST)
        throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR)
      })
  }

  @Put('/:comment_id/reply/:reply_id')
  @ApiOperation({ summary: '編輯回覆' })
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Comment })
  async updateReply(@Req() req, @Param('comment_id') comment_id, @Param('reply_id') reply_id, @Body() body: UpdateReplyDto): Promise<Object> {
    let user_id = req.payload.user_id
    let reply = await this.commentsService.findReplyById(comment_id, reply_id)
    if (reply.creator_id !== user_id)
      throw new HttpException('only creater can update', HttpStatus.FORBIDDEN)
    return await this.commentsService.updateReply(comment_id, reply_id, body).catch(err => {
      if (err.kind === 'ObjectId')
        throw new HttpException('reply not found', HttpStatus.BAD_REQUEST)
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }

  @Delete('/:comment_id/reply/:reply_id')
  @ApiOperation({ summary: '刪除回覆' })
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async deleteReply(@Req() req, @Param('comment_id') comment_id, @Param('reply_id') reply_id, @Body() body): Promise<Object> {
    let user_id = req.payload.user_id
    let reply = await this.commentsService.findReplyById(comment_id, reply_id)
    if (reply.creator_id !== user_id)
      throw new HttpException('only creater can update', HttpStatus.FORBIDDEN)
    return await this.commentsService.deleteReply(comment_id, reply_id).catch(err => {
      console.log(err)
      if (err.kind === 'ObjectId')
        throw new HttpException('reply not found', HttpStatus.BAD_REQUEST)
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }

}
