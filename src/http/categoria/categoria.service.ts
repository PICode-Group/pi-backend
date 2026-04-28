import { Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
      @InjectRepository(CategoriaEntity)
      private readonly clientesRepository: Repository<CategoriaEntity>,
    ) {}
    
   async create(createCategoriaDto: CreateCategoriaDto) {
    const categoria = await this.clientesRepository.create(createCategoriaDto);
    return this.clientesRepository.save(categoria);
  }

  findAll() {
    return this.clientesRepository.find();
  }

  findOne(id: number) {
    return this.clientesRepository.findBy({id});
  }

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return `This action updates a #${id} categoria`;
  }

  remove(id: number) {
    return this.clientesRepository.delete(id);
  }
}
