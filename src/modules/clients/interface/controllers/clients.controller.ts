import { Body, Controller, Post } from '@nestjs/common';
import { CreateClientDto } from '../../application/dto/create-client.dto';
import { CreateClientUseCase } from '../../application/use-cases/create-client.use-case';

@Controller('clients')
export class ClientsController {
  constructor(private readonly createClient: CreateClientUseCase) {}

  @Post()
  async create(@Body() dto: CreateClientDto) {
    const client = await this.createClient.execute(dto.number, dto.name);
    return {
      id: client.id,
      number: client.number,
    };
  }
}
