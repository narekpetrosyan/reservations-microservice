import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDocument } from './models/user.schema';

const getCurrentUserByContext = (ctx: ExecutionContext): UserDocument => {
  return ctx.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx),
);
