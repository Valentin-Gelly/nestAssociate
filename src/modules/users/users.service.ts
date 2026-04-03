import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      10,
    );
    const user = {
      ...createUserDto,
      password: hashedPassword,
      createdAt: new Date(), // Ajout automatique de la date de création
    };
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async assignInterests(userId: string, interests: any[]) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });
    if (!user) {
      return null;
    }

    interests.forEach((interest) => {
      if (!user.interests.some((i) => i.id === interest.id)) {
        user.interests.push(interest);
      }
    });

    return this.userRepository.save(user);
  }

  async findInterests(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });
    return user?.interests || [];
  }
}

export default UsersService;
