export class LockFailedException extends Error {
  constructor(lockId: any) {
    super();
    this.message = `加锁失败。目标：${lockId}`;
  }
}
