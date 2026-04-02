import { Category } from 'src/modules/category/entities/category.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Interest } from 'src/modules/interests/entities/interest.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Investment } from 'src/modules/investments/entities/investment.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  title: string;

  @Column()
  description: string;

  @Column()
  budget: number;

  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

  @ManyToMany(() => Interest, (interest) => interest.projects, {
    cascade: true,
  })
  @JoinTable({
    name: 'project_interests',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'interest_id', referencedColumnName: 'id' },
  })
  interests: Interest[];

  @ManyToOne(() => User, (user) => user.projects)
  owner: User;

  @OneToMany(() => Investment, (investment) => investment.project)
  investments: Investment[];
}
