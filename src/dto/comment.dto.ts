import { ApiProperty , PartialType} from '@nestjs/swagger';
import { IsUUID, IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';
export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  target_id: string

  @IsString()
  @ApiProperty()
  content: string

  @IsNumber()
  @ApiProperty()
  rank: number

  @IsNotEmpty()
  @IsString()
  creator_id: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  creator_display_name: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  tag:string

  edited_at:Date

  deleted: boolean;

}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}

export class CreateReplyDto {
  @IsString()
  @ApiProperty()
  content: string

  @IsNotEmpty()
  @IsString()
  creator_id: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  creator_display_name: string

  created_at:Date
  updated_at:Date
}

export class UpdateReplyDto extends PartialType(CreateReplyDto) {}
