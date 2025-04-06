import { Test, TestingModule } from '@nestjs/testing';
import { CreateClientUseCase } from './create-client.use-case';
import { ClientRepository } from '../../domain/repositories/client.repository';
import { Client } from '../../domain/entities/client.entity';

describe('CreateClientUseCase', () => {
  let useCase: CreateClientUseCase;
  let clientRepo: ClientRepository;

  const mockClientRepo: ClientRepository = {
    create: jest.fn(),
    findByNumber: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateClientUseCase,
        {
          provide: 'ClientRepository',
          useValue: mockClientRepo,
        },
      ],
    }).compile();

    useCase = module.get(CreateClientUseCase);
    clientRepo = module.get('ClientRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um novo cliente com número e nome', async () => {
    const number = '1234567890';
    const name = 'Cliente Teste';

    const client = await useCase.execute(number, name);

    expect(client).toBeInstanceOf(Client);
    expect(client.number).toBe(number);
    expect(client.name).toBe(name);
    expect(clientRepo.create).toHaveBeenCalledWith(expect.any(Client));
  });
});
