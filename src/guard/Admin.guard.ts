import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AdminAuth implements CanActivate{
    
    constructor ( 
        private jwtService: JwtService 
    ){}

    async canActivate( context: ExecutionContext ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);
        if (!token) {throw new UnauthorizedException}
        try {
        const payload = await this.jwtService.verifyAsync(token, {
            secret: process.env.SECRET_JWT
        })
        request['user'] = payload;

        if (payload.role !== "ADMIN") { throw new ForbiddenException }
        
        } catch (err){
            throw new UnauthorizedException(err);
        }
        return true;
    }

    private extractToken(request: Request): string | undefined {
        const headers = request.headers?.authorization;
        if (headers && headers.startsWith("Bearer ")){
            const token = headers.split(" ")[1];
            return token;
        } 
        const cookies = request.headers.cookie?.split("token=")[1].split(";")[0];
        return cookies;
    }

}