import { ValidationError } from '@nestjs/common';
import { WrongContentException } from './wrong-content.exception';

export interface DuplicateFieldInfo {
  property: string;
  value: any;
  name?: string;
  message?: string;
}

export class DuplicateEntityException extends WrongContentException {
  errorObj: { [p: string]: any; message: ValidationError[] };
  constructor(exceptionInfo: DuplicateFieldInfo[]) {
    super(DuplicateEntityException.getValidationError(exceptionInfo));
  }

  private static getValidationError(
    exceptionInfo: DuplicateFieldInfo[],
  ): ValidationError[] {
    return exceptionInfo.map((item) => {
      const property: string = item.property;
      const value: any = item.value;
      const message: string = item.message
        ? item.message
        : `${item.name || ''}已存在相同的值「${item.value}」`;
      return {
        property,
        value,
        constraints: { duplicate: message },
        target: undefined,
        children: [],
      } as ValidationError;
    });
  }
}
