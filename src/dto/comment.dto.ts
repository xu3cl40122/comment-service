import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';
export class FileDto {
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


