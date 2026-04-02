import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';

const mockProject = { id: 'p1', title: 'Project 1', interests: [] };

const mockQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([mockProject]),
};

const repositoryMockFactory = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
});

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findRecommended returns projects for interest ids', async () => {
    const result = await service.findRecommended(['i1', 'i2']);
    expect(result).toEqual([mockProject]);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('interest.id IN (:...ids)', { ids: ['i1', 'i2'] });
  });

  it('findRecommended returns empty with no interests', async () => {
    const result = await service.findRecommended([]);
    expect(result).toEqual([]);
  });
});
