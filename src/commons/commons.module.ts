import { Module } from '@nestjs/common';
import { PasswordConverter } from './services/password-converter';

@Module({
  providers: [PasswordConverter],
  exports: [PasswordConverter],
})
export class CommonsModule {}
