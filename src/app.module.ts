import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import * as dotenv from 'dotenv';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth/auth.guard';
import { ProjectsModule } from './projects/projects.module';
import { CategoryModule } from './category/category.module';

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
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {}
