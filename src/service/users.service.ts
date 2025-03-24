import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto, userLoginDto } from 'src/models/user';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ){}

    async UserCreation(user: UserDto): Promise<any> {
        let hashPassword: string; 
        if(user.password === user.repassword){
            hashPassword = await bcrypt.hash(user.password, 10);
        } else {
            throw new Error("As senhas devem ser iguais");
        }
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
        return {message: "Usuario logado", userLogin}
    }

    async getAllUsers():Promise<any>{
        const users = await this.userRepo.find();
        return users
    }

   
}
