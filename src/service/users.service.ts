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
        const userExists = await this.getAllUsers(user.user);
        if(userExists) {
            return {message: "Usuário já existente!"}
        }
        if(user.password !== user.repassword){
            throw new Error("As senhas devem ser iguais!");
        }
        const hashPassword = await bcrypt.hash(user.password, 10);
        const createUser = this.userRepo.create({
            user: user.user,
            password: hashPassword,
            email: user.email,
            role: "USER"
        });
        await this.userRepo.save(createUser);
        return { message: "Usuário criado com sucesso" }
    }

    async UserLogin(userInfo: userLoginDto): Promise<any>{
        const userLogin = await this.userRepo.findOne({where: {user: userInfo.user}})
        if(!userLogin) {
            return "Usuário não encontrado!"
        }
        const matchPassword = await bcrypt.compare(userInfo.password, userLogin.password);
        if(!matchPassword){
            return "As senhas devem ser iguais!"
        }
        const payload = { sub: userLogin.id, username: userLogin.user, role: userLogin.role };
        return { access_token: this.jwtService.sign(payload) };
    }

    async getAllUsers(user?: string):Promise<any>{
        if(!user) {
            return await this.userRepo.find();
        } else {
            let userExists = await this.userRepo.find({where: {user: user}})
            if (userExists.length > 0){
                return true
            }
            return false
        }
    }


    //////////
    async deleteDB(){
        await this.userRepo.delete({});
    }
   
}
