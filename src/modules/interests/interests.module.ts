import { Module } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from './entities/interest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interest])],
  providers: [InterestsService],
  controllers: [InterestsController],
  exports: [InterestsService],
})
export class InterestsModule {}
