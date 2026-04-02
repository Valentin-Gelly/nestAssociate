import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { InterestsService } from 'src/modules/interests/interests.service';
import { Interest } from 'src/modules/interests/entities/interest.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';

@Controller('users/interests')
@UseGuards(AuthGuard)
export class UsersInterestsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly interestsService: InterestsService,
  ) {}

  @Get()
  async getUserInterests(@Req() req: Request) {
    const currentUser = (req as any).user;
    return this.usersService.findInterests(currentUser.sub);
  }

  @Post()
  async setUserInterests(
    @Req() req: Request,
    @Body('interestIds') interestIds: string[],
    @Body('interestNames') interestNames: string[],
  ) {
    const currentUser = (req as any).user;
    const ids = interestIds || [];
    const names = interestNames || [];

    let interests: Interest[] = [];

    if (ids.length) {
      interests = await this.interestsService.findByIds(ids);
    }

    if (names.length) {
      const created = await this.interestsService.createMany(names);
      interests = [...interests, ...created];
    }

    if (!interests.length) {
      throw new BadRequestException(
        'At least one interest id or name must be provided',
      );
    }

    return this.usersService.assignInterests(currentUser.sub, interests);
  }
}
