import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://admin:27859696@mongo:27017'), CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
