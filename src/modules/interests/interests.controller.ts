import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Get()
  findAll() {
    return this.interestsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body('name') name: string) {
    return this.interestsService.create(name);
  }
}
