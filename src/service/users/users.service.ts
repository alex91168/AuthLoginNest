import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ){}

    async UserCreation(user: User): Promise<any> {
        if(user.password === user.repassword){
            const idGen = Date.now;
            const id = Number(idGen) % 1234567;
            console.log(id)
            const createUser = this.userRepo.create(user);
            await this.userRepo.save(createUser);
            return {message: "Usuario criado com sucesso"}
        }
        throw new Error("As senhas devem ser iguais");
    }

    async UserLogin(user: string, password:string): Promise<any>{
        const userLogin = await this.userRepo.findOne({where: {name: user}})
        console.log(userLogin, user, password)
        if(!userLogin) {
            return "User not found"
        }
        const matchPassword = userLogin.password === password;
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
