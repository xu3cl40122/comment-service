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
  constructor(private readonly commentsService: CommentsService){}

  @Get()
  async queryComments(@Query() query): Promise<Object> {
    return await this.commentsService.findAll();
  }

  @Post()
  async addComment(@Req() req, @Body() body): Promise<Object> {
    return await this.commentsService.create(body);
  }

}
