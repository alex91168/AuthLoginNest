import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from 'src/controllers/admin.controller';
import { UserController } from 'src/controllers/user.controller';
import { User } from 'src/entities/user.entity';
import { AdminService } from 'src/service/admin.service';
import { UsersService } from 'src/service/users.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_JWT,
            signOptions: {expiresIn: '60m'}
        })
    ],
    controllers: [UserController, AdminController],
    providers: [UsersService, AdminService],
})
export class UserModule {}
