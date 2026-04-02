import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { UsersService } from 'src/modules/users/users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { UserRole } from 'src/modules/users/entities/user.entity';
import type { Request } from 'express';

@Controller('projects')
export class ProjectsRecommendedController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('recommended')
  @Roles(UserRole.INVESTOR, UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async recommended(@Req() req: Request) {
    const currentUser = (req as any).user;
    const userInterests = await this.usersService.findInterests(
      currentUser.sub,
    );
    const interestIds = userInterests.map((i) => i.id);
    return this.projectsService.findRecommended(interestIds);
  }
}
