import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserDto, userLoginDto } from 'src/models/user';
import { UserGuard } from 'src/guard/User.guard';

@Controller()
export class UserController {
  constructor(
    private readonly user: UsersService
   ) {}

  @Post('create')
  async createUser(@Body() user: UserDto): Promise<any> {
    try{
      const response = this.user.UserCreation(user);
      return response;

    } catch (err) {
      throw new Error(err);
    }
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

  /////////////////////////
  @UseGuards(UserGuard)
  @Delete('deletar-banco-dados')
  async deleteAll(): Promise<any> {
    this.user.deleteDB();
    return {message: "banco de dados deletado"}
  }

}
