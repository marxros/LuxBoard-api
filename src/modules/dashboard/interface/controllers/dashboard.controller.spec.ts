import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { GetDashboardDataUseCase } from '../../application/use-cases/get-dashboard-data.use-case';
import { GetDashboardDataDto } from '../../application/dto/get-dashboard-data.dto';

describe('DashboardController', () => {
  let controller: DashboardController;
  let useCase: GetDashboardDataUseCase;

  const mockDashboardData = {
    summary: {
      totalEnergiaConsumidaKwh: 1000,
      totalEnergiaCompensadaKwh: 800,
      totalValorSemGD: 5000,
      totalEconomiaGD: -2000,
    },
    monthly: [
      {
        month: '1/2024',
        energiaConsumidaKwh: 200,
        energiaCompensadaKwh: 180,
        valorTotalSemGD: 1000,
        economiaGD: -400,
      },
    ],
  };

  const mockUseCase = {
    execute: jest.fn().mockResolvedValue(mockDashboardData),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: GetDashboardDataUseCase,
          useValue: mockUseCase,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    useCase = module.get<GetDashboardDataUseCase>(GetDashboardDataUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar os dados do dashboard conforme o useCase', async () => {
    const query: GetDashboardDataDto = {
      clientNumber: '12345',
      start: '2024-01-01',
      end: '2024-06-30',
    };

    const result = await controller.getDashboardData(query);

    expect(useCase.execute).toHaveBeenCalledWith(query);
    expect(result).toEqual(mockDashboardData);
  });
});
