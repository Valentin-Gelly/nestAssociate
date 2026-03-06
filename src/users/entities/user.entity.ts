import { Project } from 'src/projects/entities/project.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  INVESTOR = 'investor',
  ENTREPRENEUR = 'entrepreneur',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  lastname: string;

  @Column({
    nullable: true,
  })
  firstname: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ENTREPRENEUR,
  })
  role: UserRole;

  @Column()
  createdAt: Date;

  @OneToMany(()=> Project, (project) => project.id)
  projects: Project
}
