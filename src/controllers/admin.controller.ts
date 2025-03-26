import { Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/user/user.decorator';
import { UserGuard } from 'src/guard/User.guard';
import { AdminService } from 'src/service/admin.service';

@Controller('admin')
@UseGuards(UserGuard)
@Roles('ADMIN')
export class AdminController {
    constructor ( private admin: AdminService ){}
   
    @Delete('deletar-banco-dados')
    async deleteAll(): Promise<{ message: string }> {
      try {
        this.admin.deleteDB();
        return {message: "banco de dados deletado"}
      } catch (err) {
        throw new Error(err);
      }
    }

    @Get('list-users')
    async getAllLogin(): Promise<Object>{
      const response = this.admin.getAllUsers();
      return response;
    }

    @Put('promote/:id')
    async promoteUser(@Param('id') userId: string): Promise<{message: string}>{
      const response = await this.admin.promoteUser(userId);
      return response;
    }
    
}
