import { Test, TestingModule } from '@nestjs/testing';
import { GetDashboardDataUseCase } from './get-dashboard-data.use-case';
import { PrismaService } from '@/shared/prisma.service';
import { parseISO } from 'date-fns';

describe('GetDashboardDataUseCase', () => {
  let useCase: GetDashboardDataUseCase;
  const mockPrisma = {
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
        GetDashboardDataUseCase,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    useCase = module.get(GetDashboardDataUseCase);
    jest.clearAllMocks();
  });

  it('deve retornar null e lista vazia se o cliente não for encontrado', async () => {
    mockPrisma.client.findFirst.mockResolvedValue(null);

    const result = await useCase.execute({
      clientNumber: '123',
      start: '',
      end: '',
    });

    expect(result).toEqual({ summary: null, monthly: [] });
  });

  it('deve retornar os dados agregados corretamente por mês para um cliente existente', async () => {
    const fakeClient = { id: 'c1', number: '123' };
    const bills = [
      {
        referenceMonth: parseISO('2024-01-01'),
        energiaEletricaKwh: 100,
        energiaSceeKwh: 50,
        energiaCompensadaKwh: 20,
        valorTotalSemGD: 300,
        economiaGD: -120,
      },
      {
        referenceMonth: parseISO('2024-01-15'),
        energiaEletricaKwh: 200,
        energiaSceeKwh: 100,
        energiaCompensadaKwh: 40,
        valorTotalSemGD: 500,
        economiaGD: 50,
      },
    ];

    mockPrisma.client.findFirst.mockResolvedValue(fakeClient);
    mockPrisma.bill.findMany.mockResolvedValue(bills);

    const result = await useCase.execute({
      clientNumber: '123',
      start: '',
      end: '',
    });

    expect(result.summary).toEqual({
      totalEnergiaConsumidaKwh: 450,
      totalEnergiaCompensadaKwh: 60,
      totalValorSemGD: 800,
      totalEconomiaGD: -70, // -120 + 50
    });

    expect(result.monthly).toEqual([
      {
        month: '1/2024',
        energiaConsumidaKwh: 450,
        energiaCompensadaKwh: 60,
        valorTotalSemGD: 800,
        economiaGD: -70,
      },
    ]);
  });

  it('deve retornar dados agregados de todos os clientes se nenhum filtro for informado', async () => {
    const bills = [
      {
        referenceMonth: parseISO('2024-02-01'),
        energiaEletricaKwh: 150,
        energiaSceeKwh: 50,
        energiaCompensadaKwh: 25,
        valorTotalSemGD: 400,
        economiaGD: -50,
      },
    ];

    mockPrisma.bill.findMany.mockResolvedValue(bills);

    const result = await useCase.execute({
      clientNumber: '',
      start: '',
      end: '',
    });

    expect(mockPrisma.client.findFirst).not.toHaveBeenCalled();

    expect(result).toEqual({
      summary: {
        totalEnergiaConsumidaKwh: 200,
        totalEnergiaCompensadaKwh: 25,
        totalValorSemGD: 400,
        totalEconomiaGD: -50,
      },
      monthly: [
        {
          month: '2/2024',
          energiaConsumidaKwh: 200,
          energiaCompensadaKwh: 25,
          valorTotalSemGD: 400,
          economiaGD: -50,
        },
      ],
    });
  });
});
