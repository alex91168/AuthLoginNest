import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserDto, userLoginDto } from 'src/models/user';

@Controller()
export class UserController {
  constructor(
    private readonly user: UsersService
   ) {}

  @Post('create')
  async createUser(@Body() user: UserDto): Promise<any> {
    const response = this.user.UserCreation(user);
    return response;
  }

  @Post('login')
  async loginUser(@Body() userInfo: userLoginDto): Promise<any>{
    const response = this.user.UserLogin(userInfo);
    return response;
  }

  @Get()
  async getAllLogin(): Promise<any>{
    const response = this.user.getAllUsers();
    return response;
  }

}
