import { Injectable } from '@nestjs/common';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Investment } from './entities/investment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InvestmentsService {

  constructor(
    @InjectRepository(Investment)
    private investmentRepository: Repository<Investment>,
  ) {}


  create(createInvestmentDto: CreateInvestmentDto) {
    const investment = this.investmentRepository.create(createInvestmentDto);
    return this.investmentRepository.save(investment);
  }

  remove(id: number) {
    return this.investmentRepository.delete(id);
  }

  findAllInvestmentsForOwner(options: any) {
    return this.investmentRepository.find(options);
  }
}
