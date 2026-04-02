import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import UsersService from './users.service';
import { User } from './entities/user.entity';

const mockUser = { id: 'u1', email: 'test@test.com', interests: [] };

const repositoryMockFactory = () => ({
  findOne: jest.fn().mockResolvedValue(mockUser),
  save: jest.fn().mockResolvedValue(mockUser),
});

describe('UsersService', () => {
  let service: UsersService;
  let repo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('assignInterests updates user interests', async () => {
    const interest = { id: 'i1', name: 'Tech' };
    const result = await service.assignInterests('u1', [interest]);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 'u1' },
      relations: ['interests'],
    });
    expect(repo.save).toHaveBeenCalledWith({ ...mockUser, interests: [interest] });
    expect(result).toEqual(mockUser);
  });

  it('findInterests returns interests array', async () => {
    const result = await service.findInterests('u1');
    expect(result).toEqual([{ id: 'i1', name: 'Tech' }]);
  });
});
