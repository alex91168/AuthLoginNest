import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserDto, userLoginDto } from 'src/models/user';
import { Response } from 'express';
import { UserGuard } from 'src/guard/User.guard';

@Controller()
export class UserController {
  constructor(
    private readonly user: UsersService
   ) {}

  @Post('create')
  async createUser(@Body() user: UserDto): Promise<{message: string}> {
    try{
      const response = this.user.UserCreation(user);
      return response;

    } catch (err) {
      throw new Error(err);
    }
  }

  @Post('login')
  async loginUser(@Body() userInfo: userLoginDto, @Res() res: Response): Promise<any>{
    const response = await this.user.UserLogin(userInfo);

    res.cookie('token', response.access_token, {
      httpOnly: true,
      secure: process.env.SECRET_JWT === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    })
    res.cookie('userId', response.userId, {
      httpOnly: false,
      sameSite: 'strict',
      maxAge: 3600000,
    })

    return res.send(response); 
  }
  
  @UseGuards(UserGuard)
  @Post('logout')
  async userLogout(@Res() res: Response): Promise<any> {
    res.clearCookie('token');
    res.clearCookie('userId');
    return res.send({message: 'Logout realizado com sucesso'});
  }

}
