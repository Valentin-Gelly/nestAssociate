import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsRelations } from 'typeorm';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private categoryService: CategoryService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const category = await this.categoryService.findByName(
      createProjectDto.category,
    );
    if (!category) {
      throw new Error('Category not found');
    }

    const project = new Project();
    project.title = createProjectDto.title;
    project.description = createProjectDto.description || '';
    project.budget = createProjectDto.budget;
    project.category = category;

    this.projectRepository.create(project);
    return this.projectRepository.save(project);
  }

  findAll(options?: { relations?: any }) {
    return this.projectRepository.find(options || {});
  }

  findOne(id: string, options?: { relations?: any }) {
    return this.projectRepository.findOne({ where: { id }, ...options });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (updateProjectDto.category) {
      const category = await this.categoryService.findOne(
        updateProjectDto.category,
      );
      if (!category) {
        throw new Error('Category not found');
      }
      project.category = category;
    }

    if (updateProjectDto.title !== undefined) {
      project.title = updateProjectDto.title;
    }

    if (updateProjectDto.description !== undefined) {
      project.description = updateProjectDto.description;
    }

    if (updateProjectDto.budget !== undefined) {
      project.budget = updateProjectDto.budget;
    }

    return this.projectRepository.save(project);
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
