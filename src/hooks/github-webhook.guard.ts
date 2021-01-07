import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HooksService } from './hooks.service';
import { Request } from 'express';

@Injectable()
export class GithubWebhookGuard implements CanActivate {
  constructor(private readonly hooksService: HooksService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    console.log(request.headers, request);
    return this.hooksService.verifyGithubSignature(
      JSON.stringify(request.body),
      request.get('X-Hub-Signature-256'),
    );
  }
}
