import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import * as redisStore from 'cache-manager-ioredis';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/blog'),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 60,
    }),
    UserModule,
    AuthModule,
    BlogModule,
  ],
})
export class AppModule {}
