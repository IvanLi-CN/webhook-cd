export class ApplicationException extends Error {
  code: number;
  error: Error;

  constructor(
    message:
      | string
      | { error?: Error; message?: string | object; code?: number },
  ) {
    if (message instanceof Object) {
      super();
      this.code = message.code;
      this.error = message.error;
      this.message = message.message as any;
    } else if (typeof message === 'string') {
      super((message as unknown) as any);
    } else {
      super((message as unknown) as any);
    }
  }
}
