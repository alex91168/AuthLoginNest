import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto, userLoginDto } from 'src/models/user';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from './admin.service';


@Injectable()
export class UsersService {

    constructor(
        private readonly adminService: AdminService,
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ){}

    async UserCreation(user: UserDto): Promise<{message: string}> {
        if (user.user === undefined || user.email === undefined ) {
            throw new Error("Formulario invalido");
        }
        const userExists = await this.adminService.getAllUsers(user.user);
        if(userExists) {
            throw new ConflictException('Nome de usuário já está em uso.');
        }
        if(user.password !== user.repassword){
            throw new BadRequestException('As senhas devem ser iguais!');
        }
        const createId = Date.now().toString();
        const hashPassword = await bcrypt.hash(user.password, 10);
        const payload = { sub: createId, username: user.user, status: "pending" };
        const validationToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const createUser = this.userRepo.create({
            userId: createId,
            user: user.user,
            password: hashPassword,
            email: user.email,
            role: "USER",
            status: "pending",
            validationToken: validationToken
        });
        await this.userRepo.save(createUser);
        return { message: "Usuário criado com sucesso" }
    }

    async UserLogin(userInfo: userLoginDto): Promise<any>{
        const userLogin = await this.userRepo.findOne({where: {user: userInfo.user}})
        if(!userLogin) {
            return new BadRequestException('Usuário não encontrado.');
        }
        const matchPassword = await bcrypt.compare(userInfo.password, userLogin.password);
        if(!matchPassword){
            throw new BadRequestException('Senha incorreta!');
        }
        const payload = { sub: userLogin.id, username: userLogin.user, role: userLogin.role };
        return { access_token: this.jwtService.sign(payload), userId: userLogin.userId };
    }
   
}
