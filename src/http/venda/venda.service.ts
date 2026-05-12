import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { 
  CreateVendaDto, 
  AdicionarItemDto, 
  AplicarDescontoDto, 
  RegistrarPagamentoDto, 
  FiltroVendaDto 
} from 'src/domain/DTOs/Venda.dto';
import { VendaRepository } from 'src/infra/repos/venda.repository';
import { ProdutoRepository } from 'src/infra/repos/produto.repository';
import { StatusVenda } from 'src/domain/entities/Venda.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class VendaService {
  constructor(
    private readonly repository: VendaRepository,
    private readonly produtoRepository: ProdutoRepository,
    private readonly dataSource: DataSource,
  ) {}

  async listar(filtros: FiltroVendaDto) {
    return await this.repository.buscarComFiltros(filtros);
  }

  async buscarPorId(id: string) {
    const venda = await this.repository.buscarPorId(id);
    if (!venda) {
      throw new NotFoundException('Venda não encontrada');
    }
    return venda;
  }

  async abrirVenda(dados: CreateVendaDto) {
    return await this.repository.salvarVenda({
      cliente_id: dados.cliente_id as any,
      usuario_id: dados.usuario_id as any,
      status: StatusVenda.ABERTA,
      valor_total: 0,
      desconto: 0,
    });
  }

  async adicionarItem(vendaId: string, dados: AdicionarItemDto) {
    const venda = await this.buscarPorId(vendaId);
    
    if (venda.status !== StatusVenda.ABERTA) {
      throw new BadRequestException('Não é possível adicionar itens a uma venda que não está ABERTA');
    }

    const produto = await this.produtoRepository.buscarPorId(dados.produto_id);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    // RN1: Verificar estoque
    if (produto.estoque < dados.quantidade) {
      throw new BadRequestException(`Estoque insuficiente. Disponível: ${produto.estoque}`);
    }

    // RN4/RN5: Preço e Subtotal
    const precoUnitario = produto.preco_venda;
    const subtotal = dados.quantidade * precoUnitario;

    await this.repository.salvarItem({
      venda_id: venda.id as any,
      produto_id: produto.id as any,
      quantidade: dados.quantidade,
      preco_unitario: precoUnitario,
      subtotal: subtotal,
    });

    return await this.atualizarTotalVenda(vendaId);
  }

  async removerItem(vendaId: string, itemId: string) {
    const venda = await this.buscarPorId(vendaId);
    if (venda.status !== StatusVenda.ABERTA) {
      throw new BadRequestException('Não é possível remover itens de uma venda que não está ABERTA');
    }

    await this.repository.removerItem(itemId);
    return await this.atualizarTotalVenda(vendaId);
  }

  async aplicarDesconto(vendaId: string, dados: AplicarDescontoDto) {
    const venda = await this.buscarPorId(vendaId);
    if (venda.status !== StatusVenda.ABERTA) {
      throw new BadRequestException('Não é possível aplicar desconto em uma venda que não está ABERTA');
    }

    venda.desconto = dados.desconto;
    await this.repository.salvarVenda(venda);
    return await this.atualizarTotalVenda(vendaId);
  }

  async registrarPagamento(vendaId: string, dados: RegistrarPagamentoDto) {
    const venda = await this.buscarPorId(vendaId);
    if (venda.status !== StatusVenda.ABERTA) {
      throw new BadRequestException('Pagamentos só podem ser registrados em vendas ABERTAS');
    }

    await this.repository.salvarPagamento({
      venda_id: venda.id as any,
      tipo: dados.tipo,
      valor_pago: dados.valor_pago,
    });

    return await this.buscarPorId(vendaId);
  }

  async finalizarVenda(vendaId: string) {
    const venda = await this.buscarPorId(vendaId);
    if (venda.status !== StatusVenda.ABERTA) {
      throw new BadRequestException('Apenas vendas ABERTAS podem ser finalizadas');
    }

    const totalPagamentos = venda.pagamentos.reduce((acc, p) => acc + Number(p.valor_pago), 0);
    if (totalPagamentos < venda.valor_total) {
      throw new BadRequestException(`Valor pago (${totalPagamentos}) insuficiente para o total (${venda.valor_total})`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // RN2: Baixa automática de estoque
      for (const item of venda.itensVenda) {
        const produto = await this.produtoRepository.buscarPorId(item.produto_id as any);
        if (produto.estoque < item.quantidade) {
          throw new BadRequestException(`Estoque do produto ${produto.nome} esgotou durante a finalização`);
        }
        produto.estoque -= item.quantidade;
        await this.produtoRepository.salvar(produto);
      }

      venda.status = StatusVenda.PAGA;
      await this.repository.salvarVenda(venda);

      await queryRunner.commitTransaction();
      return await this.buscarPorId(vendaId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelarVenda(vendaId: string) {
    const venda = await this.buscarPorId(vendaId);
    if (venda.status === StatusVenda.CANCELADA) {
      throw new BadRequestException('Venda já está cancelada');
    }

    const statusAnterior = venda.status;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // RN3: Devolução automática se estava PAGA
      if (statusAnterior === StatusVenda.PAGA) {
        for (const item of venda.itensVenda) {
          const produto = await this.produtoRepository.buscarPorId(item.produto_id as any);
          produto.estoque += item.quantidade;
          await this.produtoRepository.salvar(produto);
        }
      }

      venda.status = StatusVenda.CANCELADA;
      await this.repository.salvarVenda(venda);

      await queryRunner.commitTransaction();
      return await this.buscarPorId(vendaId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async atualizarTotalVenda(vendaId: string) {
    const venda = await this.buscarPorId(vendaId);
    const subtotal = venda.itensVenda.reduce((acc, item) => acc + Number(item.subtotal), 0);
    
    // RN6: Cálculo do valor_total
    venda.valor_total = Math.max(0, subtotal - venda.desconto);
    await this.repository.salvarVenda(venda);
    
    return await this.buscarPorId(vendaId);
  }
}
