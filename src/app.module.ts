import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from './modules/comments/comments.module';
import { AuthModule } from './modules/auth/auth.module'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // can get env setting
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'app.env'
    }),
    // 非同步載入 要先等 ConfigModule 好了
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri: process.env.MONGO_CONNECTION,
      })
    }),
    AuthModule,
    CommentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
