import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto, userLoginDto } from 'src/models/user';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UsersService {

    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ){}

    async UserCreation(user: UserDto): Promise<any> {
        if(user.password !== user.repassword){
            throw new Error("As senhas devem ser iguais");
        }
        const hashPassword = await bcrypt.hash(user.password, 10);
        const createUser = this.userRepo.create({
            user: user.user,
            password: hashPassword,
            email: user.email
        });
        await this.userRepo.save(createUser);
        return { message: "Usuario criado com sucesso" }
    }

    async UserLogin(userInfo: userLoginDto): Promise<any>{
        const userLogin = await this.userRepo.findOne({where: {user: userInfo.user}})
        if(!userLogin) {
            return "User not found"
        }
        const matchPassword = await bcrypt.compare(userInfo.password, userLogin.password);
        if(!matchPassword){
            return "Password not match"
        }
        const payload = { sub: userLogin.id, username: userLogin.user };
        return { access_token: this.jwtService.sign(payload) };
    }

    async getAllUsers():Promise<any>{
        const users = await this.userRepo.find();
        return users
    }

   
}
