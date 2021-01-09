export class InsufficientBalanceException extends Error {
  constructor(curr: number, amount: number) {
    super();
    this.message = `余额不足。current balance：${curr}，change amount：${amount}`;
  }
}
