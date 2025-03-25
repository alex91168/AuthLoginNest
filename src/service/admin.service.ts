import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ){}

    async deleteDB(): Promise<void> {
        await this.userRepo.delete({});
    }

    async getAllUsers(user?: string):Promise<boolean | object>{
        if(!user || user.length === 0) {
            return await this.userRepo.find();
        } else {
            let userExists = await this.userRepo.find({where: {user: user}})
            if (userExists.length > 0){
                return true
            }
            return false
        }
    }

    async promoteUser(userId: string): Promise<{message: string}> {
        const findUser = await this.userRepo.findOne({where: {userId: userId}});
        if (!findUser) {
            throw new NotFoundException("Usuário não encontrado");
        }
        findUser.role = "ADMIN";
        await this.userRepo.save(findUser);
        return {message: `Usuário ${userId} foi promovido com sucesso.`}
    }
}