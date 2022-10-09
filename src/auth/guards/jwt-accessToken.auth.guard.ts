import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAccessTokenAuthGuard extends AuthGuard("jwt-access") {
  constructor(private reflector: Reflector) {
    super();
  }

  // for GlobalGuard
  // canActivate(): boolean | Promise<boolean> | Observable<boolean> {
  //   return true; // false block everything
  // }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride("isPublic", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
