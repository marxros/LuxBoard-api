export class Client {
  constructor(
    public readonly id: string,
    public readonly number: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}
