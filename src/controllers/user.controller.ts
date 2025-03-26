import { BadRequestException, Body, ConflictException, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserDto, userLoginDto } from 'src/models/user';
import { Response } from 'express';
import { UserGuard } from 'src/guard/User.guard';
import { Status } from 'src/decorators/user/user.decorator';

@Controller()
export class UserController {
  constructor(
    private readonly user: UsersService
   ) {}

  @Post('create')
  async createUser(@Body() user: UserDto, @Res() res: Response): Promise<any> {
    try{
      const response = await this.user.UserCreation(user);
      await this.loginUser(response.userDetails, res);
    } catch (err) {
      if (err instanceof ConflictException) return res.status(409).send({error: err.message});
      if (err instanceof BadRequestException) return res.status(400).send({error: err.message});
      return res.status(500).send({error: err.message});
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

  @UseGuards(UserGuard)
  @Status('active')
  @Get('auth/isUserAuth')
  async checkUserAuth(): Promise<any> {
    return {message: "Usuário autorizado."}
  }

  @UseGuards(UserGuard)
  @Post('auth/authenticate/:token')
  async authenticateUser(@Param('token') token: string): Promise<any> {

  }
}
