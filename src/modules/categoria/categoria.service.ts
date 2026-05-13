import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto, UpdateCategoriaDto, FindAllCategoriaDto } from './dto/categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaEntity } from 'src/domain/entities';
import { Repository, Like } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
      @InjectRepository(CategoriaEntity)
      private readonly categoriaRepository: Repository<CategoriaEntity>,
    ) {}
    
  create(createCategoriaDto: CreateCategoriaDto) {
    const categoria = this.categoriaRepository.create(createCategoriaDto);
    return this.categoriaRepository.save(categoria);
  }

  async findAll(query: FindAllCategoriaDto) {
    return await this.categoriaRepository.find({
      where: {
        nome: query.nome ? Like(`%${query.nome}%`) : undefined
      }
    });
  }

  async findOne(id: number) {
    const categoria = await this.categoriaRepository.findOneBy({ id });

    if (!categoria) {
      throw new NotFoundException(`Categoria ${id} não existe.`);
    }

    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id);

    if (updateCategoriaDto.nome) {
      categoria.nome = updateCategoriaDto.nome;
    }

    return await this.categoriaRepository.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.delete(id);
    return { mensagem: `Categoria ${categoria.nome} removida com sucesso` };
  }
}
