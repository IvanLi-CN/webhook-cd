import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class PasswordConverter {
  async convertToStore(pwd: string | undefined): Promise<string> {
    if (pwd === undefined) {
      return undefined;
    }
    return await hash(pwd, await genSalt());
  }
  async compare(rawPwd: string, storePwd: string): Promise<boolean> {
    return await compare(rawPwd, storePwd);
  }
}
