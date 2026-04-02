import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectsRecommendedController } from './projects-recommended.controller';
import { Project } from './entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/modules/users/users.module';
import { CategoryModule } from 'src/modules/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), CategoryModule, UsersModule],
  controllers: [ProjectsController, ProjectsRecommendedController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
