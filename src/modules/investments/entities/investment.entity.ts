import { Project } from "src/modules/projects/entities/project.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Investment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    amount: number;

    @ManyToOne(() => Project, (project) => project.investments)
    project: Project;

    @ManyToOne(() => User, (user) => user.investments)
    user: User;
}
