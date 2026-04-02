import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import UsersService from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { UserRole } from './entities/user.entity';
import { InterestsService } from '../interests/interests.service';
import { Interest } from '../interests/entities/interest.entity';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
      private readonly interestsService: InterestsService
    ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put('/profile')
  @UseGuards(AuthGuard)
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }


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
