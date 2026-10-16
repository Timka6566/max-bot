import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class MaxAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>()
        const maxUserId = request.headers['x-max-user-id']

        if (!maxUserId || typeof maxUserId != 'string') {
            throw new UnauthorizedException('x-max-user-id header is required')
        }

        (request as any).maxUserId = maxUserId;
        return true
    }
}