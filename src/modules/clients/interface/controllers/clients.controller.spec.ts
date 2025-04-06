import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { CreateClientUseCase } from '../../application/use-cases/create-client.use-case';
import { Client } from '../../domain/entities/client.entity';

describe('ClientsController', () => {
  let controller: ClientsController;
  let createClientUseCase: CreateClientUseCase;

  const mockClientUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: CreateClientUseCase,
          useValue: mockClientUseCase,
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    createClientUseCase = module.get<CreateClientUseCase>(CreateClientUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um cliente e retornar id e number', async () => {
    const dto = { number: '12345', name: 'Cliente Teste' };

    const createdClient = new Client('uuid-123', dto.number, dto.name);

    mockClientUseCase.execute.mockResolvedValue(createdClient);

    const result = await controller.create(dto);

    expect(createClientUseCase.execute).toHaveBeenCalledWith(
      '12345',
      'Cliente Teste',
    );
    expect(result).toEqual({
      id: 'uuid-123',
      number: '12345',
    });
  });
});
