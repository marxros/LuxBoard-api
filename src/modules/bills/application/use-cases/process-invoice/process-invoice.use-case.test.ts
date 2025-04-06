import { Test, TestingModule } from '@nestjs/testing';
import { ProcessInvoiceUseCase } from './process-invoice.use-case';
import { InvoiceParser } from '../../../domain/services/invoice-parser.interface';
import { ClientRepository } from '@/modules/clients/domain/repositories/client.repository';
import { BillRepository } from '../../../domain/repositories/bill.repository';
import { Client } from '@/modules/clients/domain/entities/client.entity';
import { Bill } from '../../../domain/entities/bill.entity';
import { randomUUID } from 'crypto';

describe('ProcessInvoiceUseCase', () => {
  let useCase: ProcessInvoiceUseCase;
  let parserMock: jest.Mocked<InvoiceParser>;
  let clientRepoMock: jest.Mocked<ClientRepository>;
  let billRepoMock: jest.Mocked<BillRepository>;

  beforeEach(async () => {
    parserMock = {
      parse: jest.fn(),
    };

    clientRepoMock = {
      findByNumber: jest.fn(),
      create: jest.fn(),
    } as any;

    billRepoMock = {
      create: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessInvoiceUseCase,
        { provide: 'InvoiceParser', useValue: parserMock },
        { provide: 'ClientRepository', useValue: clientRepoMock },
        { provide: 'BillRepository', useValue: billRepoMock },
      ],
    }).compile();

    useCase = module.get<ProcessInvoiceUseCase>(ProcessInvoiceUseCase);
  });

  it('should create a new client and bill if client does not exist', async () => {
    const buffer = Buffer.from('test-data');
    const parsedData = {
      clientNumber: '12345',
      clientName: 'John Doe',
      energiaEletricaKwh: 100,
      energiaEletricaValor: 200,
      energiaSceeKwh: 50,
      energiaSceeValor: 100,
      energiaCompensadaKwh: 30,
      energiaCompensadaValor: 60,
      contribIlumPublicaValor: 20,
      referenceMonth: 'JAN/2023',
    };

    parserMock.parse.mockResolvedValue(parsedData);
    clientRepoMock.findByNumber.mockResolvedValue(null);

    const result = await useCase.execute(buffer);

    expect(parserMock.parse).toHaveBeenCalledWith(buffer);
    expect(clientRepoMock.findByNumber).toHaveBeenCalledWith(
      parsedData.clientNumber,
    );
    expect(clientRepoMock.create).toHaveBeenCalledWith(expect.any(Client));
    expect(billRepoMock.create).toHaveBeenCalledWith(expect.any(Bill));
    expect(result.client).toBeInstanceOf(Client);
    expect(result.bill).toBeInstanceOf(Bill);
  });

  it('should use existing client and create a bill', async () => {
    const buffer = Buffer.from('test-data');
    const parsedData = {
      clientNumber: '12345',
      clientName: 'John Doe',
      energiaEletricaKwh: 100,
      energiaEletricaValor: 200,
      energiaSceeKwh: 50,
      energiaSceeValor: 100,
      energiaCompensadaKwh: 30,
      energiaCompensadaValor: 60,
      contribIlumPublicaValor: 20,
      referenceMonth: 'JAN/2023',
    };

    const existingClient = new Client(
      randomUUID(),
      parsedData.clientNumber,
      parsedData.clientName,
    );

    parserMock.parse.mockResolvedValue(parsedData);
    clientRepoMock.findByNumber.mockResolvedValue(existingClient);

    const result = await useCase.execute(buffer);

    expect(parserMock.parse).toHaveBeenCalledWith(buffer);
    expect(clientRepoMock.findByNumber).toHaveBeenCalledWith(
      parsedData.clientNumber,
    );
    expect(clientRepoMock.create).not.toHaveBeenCalled();
    expect(billRepoMock.create).toHaveBeenCalledWith(expect.any(Bill));
    expect(result.client).toEqual(existingClient);
    expect(result.bill).toBeInstanceOf(Bill);
  });

  it('should throw an error if referenceMonth is invalid', async () => {
    const buffer = Buffer.from('test-data');
    const parsedData = {
      clientNumber: '12345',
      clientName: 'John Doe',
      energiaEletricaKwh: 100,
      energiaEletricaValor: 200,
      energiaSceeKwh: 50,
      energiaSceeValor: 100,
      energiaCompensadaKwh: 30,
      energiaCompensadaValor: 60,
      contribIlumPublicaValor: 20,
      referenceMonth: 'INVALID/2023',
    };

    parserMock.parse.mockResolvedValue(parsedData);

    await expect(useCase.execute(buffer)).rejects.toThrow(
      'Data inválida extraída: INVALID/2023',
    );
    expect(parserMock.parse).toHaveBeenCalledWith(buffer);
    expect(clientRepoMock.findByNumber).not.toHaveBeenCalled();
    expect(clientRepoMock.create).not.toHaveBeenCalled();
    expect(billRepoMock.create).not.toHaveBeenCalled();
  });
});
