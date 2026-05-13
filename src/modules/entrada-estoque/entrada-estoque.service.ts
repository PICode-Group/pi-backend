import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEntradaEstoqueDto, FiltroEntradaDto } from './dto/entrada-estoque.dto';
import { EntradaEstoqueRepository } from './repositories/entrada-estoque.repository';
import { ProdutoRepository } from '../produto/repositories/produto.repository';
import { DataSource } from 'typeorm';
import { EntradaEstoqueEntity, ItemEntradaEntity } from 'src/domain/entities';

@Injectable()
export class EntradaEstoqueService {
  constructor(
    private readonly repository: EntradaEstoqueRepository,
    private readonly produtoRepository: ProdutoRepository,
    private readonly dataSource: DataSource,
  ) {}

  async listar(filtros: FiltroEntradaDto) {
    return await this.repository.buscarComFiltros(filtros);
  }

  async registrarEntrada(dados: CreateEntradaEstoqueDto) {
    // Usamos transaction para garantir que a entrada e a atualização do estoque sejam atômicas
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let valorTotal = 0;
      
      // 1. Criar a entrada
      const entrada = await this.repository.salvarEntrada({
        fornecedor_id: dados.fornecedor_id as any,
        usuario_id: dados.usuario_id as any,
        tipo: dados.tipo,
        observacao: dados.observacao,
      });

      // 2. Processar itens
      for (const itemDados of dados.itens) {
        const produto = await this.produtoRepository.buscarPorId(itemDados.produto_id);
        if (!produto) {
          throw new NotFoundException(`Produto ${itemDados.produto_id} não encontrado`);
        }

        const subtotal = itemDados.quantidade * itemDados.preco_custo;
        valorTotal += subtotal;

        // Salvar item da entrada
        await this.repository.salvarItem({
          entrada_id: entrada.id as any,
          produto_id: produto.id as any,
          quantidade: itemDados.quantidade,
          preco_custo: itemDados.preco_custo,
          subtotal: subtotal,
        });

        // Atualizar estoque do produto
        produto.estoque += itemDados.quantidade;
        produto.preco_custo = itemDados.preco_custo; // Atualiza o preço de custo médio/último
        await this.produtoRepository.salvar(produto);
      }

      // 3. Atualizar valor total da entrada
      entrada.valor_total = valorTotal;
      await this.repository.salvarEntrada(entrada);

      await queryRunner.commitTransaction();
      return await this.repository.buscarPorId(entrada.id);

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async consultarMovimentacoes(produtoId: string) {
    // Esta função poderia ser mais complexa, mas para este MVP vamos buscar itens de entrada
    // No Bloco 3, adicionaríamos itens de venda aqui também
    const entradaItems = await this.dataSource.getRepository(ItemEntradaEntity).find({
      where: { produto_id: produtoId as any },
      relations: ['entradaEstoque'],
      order: { entradaEstoque: { data_entrada: 'DESC' } },
    });

    return entradaItems.map(item => ({
      data: item.entradaEstoque.data_entrada,
      tipo: 'ENTRADA',
      movimentacao: item.entradaEstoque.tipo,
      quantidade: item.quantidade,
      preco: item.preco_custo,
    }));
  }
}
