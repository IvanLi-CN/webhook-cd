import { ValidationError } from '@nestjs/common';
import { WrongContentException } from './wrong-content.exception';

export interface ValueOutOfRangeInfo {
  property: string;
  value: any;
  range: string;
  name?: string;
  message?: string;
}

export class ValueOutOfRangeException extends WrongContentException {
  errorObj: { [p: string]: any; message: ValidationError[] };
  constructor(exceptionInfo: ValueOutOfRangeInfo[]) {
    super(ValueOutOfRangeException.getValidationError(exceptionInfo));
  }

  private static getValidationError(
    exceptionInfo: ValueOutOfRangeInfo[],
  ): ValidationError[] {
    return exceptionInfo.map((item) => {
      const property: string = item.property;
      const value: any = item.value;
      const message: string = item.message
        ? item.message
        : `${item.name || ''}的取值范围应是${item.range}`;
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
