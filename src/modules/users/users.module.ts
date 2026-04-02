import { Module } from '@nestjs/common';
import UsersService from './users.service';
import { UsersController } from './users.controller';
import { UsersInterestsController } from './users-interests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { InterestsModule } from 'src/modules/interests/interests.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), InterestsModule],
  controllers: [UsersController, UsersInterestsController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
