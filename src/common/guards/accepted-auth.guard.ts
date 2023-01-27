import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AcceptedAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    return req.user.role === Role.ADMIN || req.user.role === Role.USER;
  }
}
