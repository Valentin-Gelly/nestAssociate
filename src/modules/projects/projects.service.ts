import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsRelations } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  create(createProjectDto: CreateProjectDto) {
    return this.projectRepository.save(createProjectDto);
  }

  findAll(options?: { relations?: any }) {
    return this.projectRepository.find(options || {});
  }

  findOne(id: string, options?: { relations?: any }) {
    return this.projectRepository.findOne({ where: { id }, ...options });
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    return this.projectRepository.update(id, updateProjectDto);
  }

  remove(id: string) {
    return this.projectRepository.delete(id);
  }

  async findRecommended(interests: string[]) {
    if (!interests || !interests.length) {
      return [];
    }

    return this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.interests', 'interest')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.category', 'category')
      .where('interest.id IN (:...ids)', { ids: interests })
      .getMany();
  }
}
