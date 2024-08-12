import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "./../../users/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector :Reflector){}
    canActivate(context: ExecutionContext): boolean{
        const requiredRoles=this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass(),
        ]);

        if(!requiredRoles)return true;
        
        const {user}=context.switchToHttp().getRequest();
        // console.log(requiredRoles);
        // console.log(user);
        // console.log(user.role);
        
        if(requiredRoles.includes(user.role)){
            return true;
        }
        else throw new UnauthorizedException();
    }
}