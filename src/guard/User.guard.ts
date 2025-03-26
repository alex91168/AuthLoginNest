import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class UserGuard implements CanActivate {

  constructor (private jwtService: JwtService, private reflactor: Reflector){}
  async canActivate( context: ExecutionContext ): Promise<boolean> {
      const userRoles = this.reflactor.getAllAndOverride<string[]>('roles', [
        context.getHandler(),
        context.getClass()
      ]);
      const userStatus = this.reflactor.getAllAndOverride<string[]>('status', [
        context.getHandler(),
        context.getClass()
      ]);
      
      const request = context.switchToHttp().getRequest();
      const token = this.extractToken(request);

      if (!token) {throw new UnauthorizedException}

      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.SECRET_JWT
        });
        if (userRoles && !userRoles.includes(payload.role)){
          throw new ForbiddenException; 
        }
        if (userStatus && !userStatus.includes(payload.status)){
          throw new UnauthorizedException("Usuário não está ativo.");
        }
        request['user'] = payload;
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
      const cookies = request.headers.cookie;
      if (!cookies?.match("token=")) return undefined 
      const splitCookies = cookies?.split("token=")[1].split(";")[0];
      return splitCookies;
  }
}
