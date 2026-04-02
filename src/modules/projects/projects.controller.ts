import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UsersService } from 'src/modules/users/users.service';
import { UserRole } from 'src/modules/users/entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from '../roles/roles.decorator';
import type { Request } from 'express';
import { CategoryService } from 'src/modules/category/category.service';

@Controller('api/projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private categoryService: CategoryService,
  ) {}

  @Post()
  @Roles(UserRole.ENTREPRENEUR)
  @UseGuards(AuthGuard, RolesGuard)
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: Request,
  ) {
    const currentUser = (req as any).user;
    if (currentUser.role !== UserRole.ENTREPRENEUR) {
      throw new Error(
        'Permission denied: only entrepreneurs can create projects',
      );
    }
    (createProjectDto as any).ownerId = { id: currentUser.sub };
    if (createProjectDto.category) {
      const category = await this.categoryService.findOne(
        createProjectDto.category.id,
      );
      if (!category) {
        throw new Error('Category not found');
      }
    }
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll({ relations: ['owner', 'category'] });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id, {
      relations: ['owner', 'category'],
    });
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.ENTREPRENEUR)
  @UseGuards(AuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: Request,
  ) {
    const currentUser = (req as any).user;
    const project = await this.projectsService.findOne(id);
    if (!project) {
      throw new Error('Project not found');
    }
    if (
      currentUser.role !== UserRole.ADMIN &&
      (currentUser.role !== UserRole.ENTREPRENEUR ||
        project.owner.id !== currentUser.sub)
    ) {
      throw new Error('Permission denied');
    }
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.ENTREPRENEUR)
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string, @Req() req: Request) {
    const currentUser = (req as any).user;
    const project = await this.projectsService.findOne(id);
    if (!project) {
      throw new Error('Project not found');
    }
    if (
      currentUser.role !== UserRole.ADMIN &&
      (currentUser.role !== UserRole.ENTREPRENEUR ||
        project.owner.id !== currentUser.sub)
    ) {
      throw new Error('Permission denied');
    }
    return this.projectsService.remove(id);
  }
}
