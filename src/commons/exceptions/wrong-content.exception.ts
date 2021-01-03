import { UnprocessableEntityException, ValidationError } from '@nestjs/common';

export class WrongContentException extends UnprocessableEntityException {
  constructor(exceptionInfo: ValidationError[]) {
    super(exceptionInfo);
  }
}
