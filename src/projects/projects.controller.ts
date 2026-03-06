import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';
import { CategoryService } from 'src/category/category.service';

@Controller('api/projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService, private categoryService: CategoryService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Req() req: Request) {
    console.log((req as any).user);
    const currentUser = (req as any).user;
    if (currentUser.role !== UserRole.ENTREPRENEUR) {
      throw new Error("Permission denied: only entrepreneurs can create projects");
    }
    (createProjectDto as any).ownerId = { id: currentUser.sub };
    if (createProjectDto.category) {
      const category = await this.categoryService.findOne(createProjectDto.category.id);
      if (!category) {
        throw new Error("Category not found");
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
    return this.projectsService.findOne(id, { relations: ['owner', 'category'] });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Req() req: Request) {
    const currentUser = (req as any).user;
    const project = await this.projectsService.findOne(id);
    if (!project) {
      throw new Error("Project not found");
    }
    if (currentUser.role !== UserRole.ADMIN && (currentUser.role !== UserRole.ENTREPRENEUR || project.owner.id !== currentUser.sub)) {
      throw new Error("Permission denied");
    }
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const currentUser = (req as any).user;
    const project = await this.projectsService.findOne(id);
    if (!project) {
      throw new Error("Project not found");
    }
    if (currentUser.role !== UserRole.ADMIN && (currentUser.role !== UserRole.ENTREPRENEUR || project.owner.id !== currentUser.sub)) {
      throw new Error("Permission denied");
    }
    return this.projectsService.remove(id);
  }
}
