import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UsersService } from '../service/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Controller()
export class UserController {
  constructor(
    @InjectRepository(User) 
    private readonly userRepo: Repository<User> ,
    private readonly user: UsersService

   ) {}

  @Post('create')
  async createUser(@Body() user: User): Promise<any> {
    console.log("Recebido", user)
    const response = this.user.UserCreation(user)
    return response
  }

  @Post('login')
  async loginUser(@Body() user: string, password:string): Promise<any>{
    const response = this.user.UserLogin(user, password);
    return response
  }

  @Get()
  async getAllLogin(): Promise<any>{
    const response = this.user.getAllUsers();
    return response;
  }

}
