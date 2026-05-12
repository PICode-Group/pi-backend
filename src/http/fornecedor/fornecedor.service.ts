import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFornecedorDto, UpdateFornecedorDto, FiltroFornecedorDto } from 'src/domain/DTOs/Fornecedor.dto';
import { FornecedorRepository } from 'src/infra/repos/fornecedor.repository';
import { EnderecoRepository } from 'src/infra/repos/endereco.repository';
import { paginate } from 'src/common/utils/pagination.util';
import { InjectRepository } from '@nestjs/typeorm';
import { FornecedorEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class FornecedorService {
  constructor(
    private readonly fornecedorRepository: FornecedorRepository,
    private readonly enderecoRepository: EnderecoRepository,
    @InjectRepository(FornecedorEntity)
    private readonly repo: Repository<FornecedorEntity>,
  ) {}

  async listar(filtros: FiltroFornecedorDto) {
    const queryBuilder = this.repo.createQueryBuilder('f')
      .leftJoinAndSelect('f.endereco', 'e');

    if (filtros.nome) {
      queryBuilder.andWhere('f.nome LIKE :nome', { nome: `%${filtros.nome}%` });
    }

    if (filtros.cnpj) {
      queryBuilder.andWhere('f.cnpj = :cnpj', { cnpj: filtros.cnpj });
    }

    return await paginate(queryBuilder, { page: filtros.page, limit: filtros.limit });
  }

  async listarTodos() {
    return await this.fornecedorRepository.buscarTodos();
  }

  async buscarPorId(id: string) {
    const fornecedor = await this.fornecedorRepository.buscarPorId(id);
    if (!fornecedor) {
      throw new NotFoundException('Fornecedor não encontrado');
    }
    return fornecedor;
  }

  async criar(dados: CreateFornecedorDto) {
    const cnpjExistente = await this.fornecedorRepository.buscarPorCnpj(dados.cnpj);
    if (cnpjExistente) {
      throw new ConflictException('Já existe um fornecedor com este CNPJ');
    }

    const emailExistente = await this.fornecedorRepository.buscarPorEmail(dados.email);
    if (emailExistente) {
      throw new ConflictException('Já existe um fornecedor com este Email');
    }

    let endereco = null;
    if (dados.endereco) {
      endereco = await this.enderecoRepository.criarEndereco(dados.endereco);
    }

    return await this.fornecedorRepository.salvarFornecedor({
      ...dados,
      endereco: endereco,
    });
  }

  async atualizar(id: string, dados: UpdateFornecedorDto) {
    const fornecedor = await this.buscarPorId(id);

    if (dados.endereco && fornecedor.endereco) {
      // Atualiza endereço existente
      Object.assign(fornecedor.endereco, dados.endereco);
      await this.enderecoRepository.criarEndereco(fornecedor.endereco);
    } else if (dados.endereco) {
      // Cria novo endereço se não existia
      fornecedor.endereco = await this.enderecoRepository.criarEndereco(dados.endereco);
    }

    Object.assign(fornecedor, dados);
    delete (fornecedor as any).endereco; // Evita duplicidade no save do repo se não for handled corretamente

    return await this.fornecedorRepository.salvarFornecedor(fornecedor);
  }

  async remover(id: string) {
    const fornecedor = await this.buscarPorId(id);
    await this.fornecedorRepository.deletarFornecedor(id);
    return { mensagem: `Fornecedor ${fornecedor.nome} removido com sucesso` };
  }
}
