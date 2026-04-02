import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentsController } from './investments.controller';
import { InvestmentsService } from './investments.service';

const investmentsServiceMock = {
  create: jest.fn().mockResolvedValue({ id: 'inv1', amount: 1000 }),
  findAllInvestmentsForOwner: jest.fn().mockResolvedValue([]),
  remove: jest.fn().mockResolvedValue({}),
};

describe('InvestmentsController', () => {
  let controller: InvestmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestmentsController],
      providers: [{ provide: InvestmentsService, useValue: investmentsServiceMock }],
    }).compile();

    controller = module.get<InvestmentsController>(InvestmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should return created investment for investor', async () => {
    const result = await controller.create({ amount: 1000, projectId: { id: 'p1' } }, { user: { sub: 'u1', role: 'investor' } } as any);
    expect(investmentsServiceMock.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 'inv1', amount: 1000 });
  });
});
