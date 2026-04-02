import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Interest } from './entities/interest.entity';
import { Repository, In } from 'typeorm';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private interestRepository: Repository<Interest>,
  ) {}

  findAll() {
    return this.interestRepository.find();
  }

  async findByIds(ids: string[]) {
    if (!ids || !ids.length) return [];
    const interests = await this.interestRepository.find({
      where: { id: In(ids) },
    });
    if (interests.length !== ids.length) {
      const foundIds = interests.map((i) => i.id);
      const missing = ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Interests not found: ${missing.join(', ')}`);
    }
    return interests;
  }

  async findByName(name: string) {
    return this.interestRepository.findOneBy({ name });
  }

  async create(name: string) {
    const existing = await this.findByName(name);
    if (existing) {
      return existing;
    }
    const interest = this.interestRepository.create({ name });
    return this.interestRepository.save(interest);
  }

  async createMany(names: string[]) {
    const interests: Interest[] = [];
    for (const name of names) {
      const clean = name.trim();
      if (!clean) continue;
      interests.push(await this.create(clean));
    }
    return interests;
  }
}
