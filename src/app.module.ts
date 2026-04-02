import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import * as dotenv from 'dotenv';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';

import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth/auth.guard';
import { ProjectsModule } from './modules/projects/projects.module';
import { CategoryModule } from './modules/category/category.module';
import { InterestsModule } from './modules/interests/interests.module';
import { InvestmentsModule } from './modules/investments/investments.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    CategoryModule,
    InterestsModule,
    InvestmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {}
