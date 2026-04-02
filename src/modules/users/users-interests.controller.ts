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

 
}
