import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto, userLoginDto } from 'src/models/user';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AdminService } from './admin.service';


@Injectable()
export class UsersService {

    constructor(
        private readonly adminService: AdminService,
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ){}

    async UserCreation(user: UserDto): Promise<any> {
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
        const payload = { userId: createId, username: user.user, status: "pending" };
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
        const userDetails = { user: user.user, password: user.password };
        console.log("##########################", validationToken) //Enviar para o email.
        return { message: "Usuário criado com sucesso", userDetails };
    }

    async UserLogin(userInfo: userLoginDto): Promise<any>{
        const userLogin = await this.userRepo.findOne({where: {user: userInfo.user}})
        if(!userLogin) {
            return new BadRequestException('Usuário não encontrado.');
        }
        const matchPassword = await bcrypt.compare(userInfo.password, userLogin.password);
        if(!matchPassword){
            throw new BadRequestException('Senha incorreta.');
        }
        const payload = { userId: userLogin.userId, username: userLogin.user, role: userLogin.role, status: userLogin.status };
        return { access_token: this.jwtService.sign(payload), userId: userLogin.userId };
    }

    async authenticateUserEmail(token: string, userToken: string): Promise<{ message: string, access_token: string} | any> {
        try { 
            const userLoginToken = await this.jwtService.verifyAsync(userToken, {secret: process.env.SECRET_JWT});
            const userAuthToken = await this.jwtService.verifyAsync(token, {secret: process.env.SECRET_JWT});

            if(userLoginToken.userId !== userAuthToken.userId) throw new ConflictException('Token inválido.');
            const findUser = await this.userRepo.findOne({where: {userId: userLoginToken.userId}});

            if (!findUser) throw new BadRequestException("Usuario não encontrado.")
                
            if(findUser.validationToken?.match(token)){
                findUser.status = "active";
                delete findUser.validationToken;
                await this.userRepo.save(findUser);
                const payload = { userId: findUser.userId, username: findUser.user, role: findUser.role, status: findUser.status };
                return { message: "Usuário autenticado com sucesso.", access_token: this.jwtService.sign(payload) }
            } else {
                throw new BadRequestException('Token não é valido para esse usuário ou está expirado.');
            }
        } catch (err) {
            if (err instanceof TokenExpiredError) throw new BadRequestException('Token expirado, solicite um novo token.')

            throw new InternalServerErrorException('Erro ao autenticar email do usuário.')
        }
    }
   
}
