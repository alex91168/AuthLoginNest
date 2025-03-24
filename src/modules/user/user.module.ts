import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user.controller';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/service/users.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_JWT,
            signOptions: {expiresIn: '5m'}
        })
    ],
    controllers: [UserController],
    providers: [UsersService],
})
export class UserModule {}
