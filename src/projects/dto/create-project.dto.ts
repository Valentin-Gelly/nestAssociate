import { Category } from "src/category/entities/category.entity";

export class CreateProjectDto {
    title: string;
    description?: string;
    budget: number;
    category: Category;
}
