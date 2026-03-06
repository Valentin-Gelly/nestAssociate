import { Category } from "src/category/entities/category.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


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

    @ManyToOne(() => User, (user) => user.id)
    owner: User;
}
