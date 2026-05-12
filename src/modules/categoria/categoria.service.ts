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
        nome: Like(`%${query.nome}%`)
      }
    })
  }

  findOne(id: number) {
    const categoria = this.categoriaRepository.findBy({id});

    if (!categoria) {
      throw new NotFoundException(`Categoria ${id} não existe.`)
    }

    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    let categoria = await this.categoriaRepository.findOneBy({id})

    if (!categoria) {
      throw new NotFoundException(`Categoria ${id} não existe.`)
    }

    if(updateCategoriaDto.nome) {
      categoria.nome = updateCategoriaDto.nome
    } 

    await this.categoriaRepository.save(categoria)

    return categoria;
  }

  remove(id: number) {
    return this.categoriaRepository.delete(id);
  }
}
