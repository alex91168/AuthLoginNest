import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.CONNECTION_STRING,
      database: "AuthLogin",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    UserModule
  ],
})
export class AppModule {}
