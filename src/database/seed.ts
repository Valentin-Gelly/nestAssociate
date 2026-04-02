import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { User, UserRole } from '../modules/users/entities/user.entity';
import { Category } from '../modules/category/entities/category.entity';
import { Interest } from '../modules/interests/entities/interest.entity';
import { Project } from '../modules/projects/entities/project.entity';
import { Investment } from '../modules/investments/entities/investment.entity';
import bcrypt from 'bcrypt';
import { AppModule } from 'src/app.module';
import { NestFactory } from '@nestjs/core';


async function run() {

  const app = await NestFactory.createApplicationContext(AppModule);
  
  const dataSource = new DataSource({
    ...typeOrmConfig,
    entities: [User, Category, Interest, Project, Investment],
  });
  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);
  const categoryRepo = dataSource.getRepository(Category);
  const interestRepo = dataSource.getRepository(Interest);
  const projectRepo = dataSource.getRepository(Project);
  const investmentRepo = dataSource.getRepository(Investment);

  console.log('Wiping existing data...');
  await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
  await investmentRepo.clear();
  await projectRepo.clear();
  await userRepo.clear();
  await categoryRepo.clear();
  await interestRepo.clear();
  await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
  

  console.log('Creating roles and users...');
  const adminPassword = await bcrypt.hash('$Password0', 10);
  const investorPassword = await bcrypt.hash('$Password0', 10);
  const entrepreneurPassword = await bcrypt.hash('$Password0', 10);

  const admin = userRepo.create({
    email: 'admin@admin.com',
    password: adminPassword,
    role: UserRole.ADMIN,
    firstname: 'Admin',
    lastname: 'User',
    createdAt: new Date(),
  });
  const investor = userRepo.create({
    email: 'investor@invest.com',
    password: investorPassword,
    role: UserRole.INVESTOR,
    firstname: 'Investor',
    lastname: 'User',
    createdAt: new Date(),
  });
  const entrepreneur = userRepo.create({
    email: 'entrepreneur@entrepreneur.com',
    password: entrepreneurPassword,
    role: UserRole.ENTREPRENEUR,
    firstname: 'Entrepreneur',
    lastname: 'User',
    createdAt: new Date(),
  });

  await userRepo.save([admin, investor, entrepreneur]);

  console.log('Creating categories and interests...');
  const categories = await categoryRepo.save([
    categoryRepo.create({ name: 'Technologie' }),
    categoryRepo.create({ name: 'Écologie' }),
    categoryRepo.create({ name: 'Finance' }),
  ]);

  const interests = await interestRepo.save([
    interestRepo.create({ name: 'Technologie' }),
    interestRepo.create({ name: 'Écologie' }),
    interestRepo.create({ name: 'Finance' }),
  ]);

  console.log('Assigning interests to investor...');
  investor.interests = [interests[0], interests[2]];
  await userRepo.save(investor);

  console.log('Creating project sample...');
  const project = projectRepo.create({
    title: 'Projet Green Tech',
    description: 'Développer une solution écologique basée sur la data',
    budget: 150000,
    owner: entrepreneur,
    category: categories[1],
    interests: [interests[0], interests[1]],
  });
  await projectRepo.save(project);

  console.log('Creating investment sample...');
  const investment = investmentRepo.create({
    amount: 5000,
    user: investor,
    project,
  });
  await investmentRepo.save(investment);

  console.log('Fixtures insertées avec succès.');
  await dataSource.destroy();
}

run().catch((error) => {
  console.error('Erreur de seed:', error);
  process.exit(1);
});