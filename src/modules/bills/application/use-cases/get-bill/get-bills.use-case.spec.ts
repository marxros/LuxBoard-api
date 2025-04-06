import { Test, TestingModule } from '@nestjs/testing';
import { GetBillsUseCase } from './get-bills.use-case';
import { PrismaService } from '@/shared/prisma.service';
import { parseISO } from 'date-fns';

describe('GetBillsUseCase', () => {
  let useCase: GetBillsUseCase;

  const mockPrismaService = {
    client: {
      findFirst: jest.fn(),
    },
    bill: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBillsUseCase,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    useCase = module.get(GetBillsUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar faturas com os campos mapeados corretamente', async () => {
    const query = { clientNumber: '12345', month: '09/2024' };

    mockPrismaService.client.findFirst.mockResolvedValue({ id: 'abc' });

    const fakeDate = parseISO('2024-09-01');
    mockPrismaService.bill.findMany.mockResolvedValue([
      {
        id: 'bill1',
        client: { number: '12345', name: 'Cliente Teste' },
        referenceMonth: fakeDate,
        energiaEletricaValor: 100,
        energiaSceeValor: 50,
        energiaCompensadaValor: -30,
        contribIlumPublicaValor: 20,
      },
    ]);

    const result = await useCase.execute(query);

    expect(result).toEqual([
      {
        id: 'bill1',
        clientNumber: '12345',
        clientName: 'Cliente Teste',
        totalValue: 140,
        referenceMonth: '09/2024',
        downloadUrl: 'http://localhost:3000/bills/bill1/download',
      },
    ]);
  });

  it('deve retornar lista vazia se cliente não for encontrado', async () => {
    mockPrismaService.client.findFirst.mockResolvedValue(null);

    const result = await useCase.execute({
      clientNumber: '999',
      month: '01/2024',
    });

    expect(result).toEqual([]);
  });

  it('deve buscar sem filtro de cliente e data se não forem fornecidos', async () => {
    mockPrismaService.bill.findMany.mockResolvedValue([]);

    const result = await useCase.execute({ clientNumber: '', month: '' });

    expect(mockPrismaService.bill.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { referenceMonth: 'desc' },
      include: { client: true },
    });

    expect(result).toEqual([]);
  });
});
