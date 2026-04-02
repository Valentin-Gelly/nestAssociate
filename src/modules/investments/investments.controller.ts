import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { UserRole } from '../users/entities/user.entity';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('investments')
@UseGuards(AuthGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @Roles(UserRole.INVESTOR)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createInvestmentDto: CreateInvestmentDto, @Req() req) {
    const currentUser = (req as any).user;
    if (!currentUser || currentUser.role !== UserRole.INVESTOR) {
      throw new Error('Permission denied');
    }
    (createInvestmentDto as any).user = { id: currentUser.sub };
    return this.investmentsService.create(createInvestmentDto);
  }

  @Get()
  @Roles(UserRole.INVESTOR, UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  findAllInvestmentsForOwner(@Req() req) {
    const currentUser = (req as any).user;
    return this.investmentsService.findAllInvestmentsForOwner({
      where: { user: { id: currentUser.sub } },
      relations: ['user', 'project'],
    });
  }

  @Get('/project/:projectId')
  @UseGuards(AuthGuard, RolesGuard)
  findAllInvestmentForProject(@Req() req) {
    const currentUser = (req as any).user;
    if (!currentUser) {
      throw new Error('Permission denied');
    }
    return this.investmentsService.findAllInvestmentsForOwner({
      where: { project: { id: req.params.projectId } },
      relations: ['user', 'project'],
    });
  }

  @Delete(':id')
  @Roles(UserRole.INVESTOR, UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string, @Req() req) {
    const currentUser = (req as any).user;
    if (!currentUser || (currentUser.role !== UserRole.INVESTOR && currentUser.role !== UserRole.ADMIN)) {
      throw new Error('Permission denied');
    }
    return this.investmentsService.remove(+id);
  }
}
