import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { 
  CreateVendaDto, 
  AdicionarItemDto, 
  AplicarDescontoDto, 
  RegistrarPagamentoDto, 
  FiltroVendaDto,
  VendaDiretaDto 
} from 'src/domain/DTOs/Venda.dto';
import { VendaRepository } from 'src/infra/repos/venda.repository';
import { ProdutoRepository } from 'src/infra/repos/produto.repository';
import { 
  VendaEntity, 
  ItemVendaEntity, 
  PagamentoEntity, 
  StatusVenda, 
  ProdutoEntity, 
  UsuarioEntity 
} from 'src/domain/entities';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';

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

  async abrirVenda(dados: CreateVendaDto, usuarioId: string) {
    return await this.repository.salvarVenda({
      cliente_id: dados.cliente_id as any,
      usuario_id: usuarioId as any,
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

  async vendaDireta(dados: VendaDiretaDto, usuarioId: string) {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Criar a Venda
      const venda = manager.create(VendaEntity, {
        id: uuid(),
        cliente_id: dados.cliente_id as any,
        usuario_id: usuarioId as any,
        status: StatusVenda.PAGA, // Venda direta já nasce paga/finalizada
        desconto: dados.desconto || 0,
        valor_total: 0, // Será calculado abaixo
      });

      await manager.save(venda);

      let subtotalVenda = 0;

      // 2. Processar Itens
      for (const itemDados of dados.itens) {
        const produto = await manager.findOne(ProdutoEntity, {
          where: { id: itemDados.produto_id },
        });

        if (!produto) {
          throw new NotFoundException(`Produto ${itemDados.produto_id} não encontrado`);
        }

        if (produto.estoque < itemDados.quantidade) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.estoque}`,
          );
        }

        const subtotalItem = itemDados.quantidade * Number(produto.preco_venda);
        subtotalVenda += subtotalItem;

        // Criar item da venda
        const itemVenda = manager.create(ItemVendaEntity, {
          id: uuid(),
          venda_id: venda.id as any,
          produto_id: produto.id as any,
          quantidade: itemDados.quantidade,
          preco_unitario: produto.preco_venda,
          subtotal: subtotalItem,
        });

        await manager.save(itemVenda);

        // Baixar estoque
        produto.estoque -= itemDados.quantidade;
        await manager.save(produto);
      }

      // 3. Atualizar Totais da Venda
      venda.valor_total = Math.max(0, subtotalVenda - venda.desconto);
      await manager.save(venda);

      // 4. Registrar Pagamento
      if (dados.pagamento.valor_pago < venda.valor_total) {
        throw new BadRequestException(
          `Valor pago (${dados.pagamento.valor_pago}) insuficiente para o total (${venda.valor_total})`,
        );
      }

      const pagamento = manager.create(PagamentoEntity, {
        id: uuid(),
        venda_id: venda.id as any,
        tipo: dados.pagamento.tipo,
        valor_pago: dados.pagamento.valor_pago,
        data_pagamento: new Date(),
      });

      await manager.save(pagamento);

      // 5. Retornar a venda completa
      return await manager.findOne(VendaEntity, {
        where: { id: venda.id },
        relations: ['itensVenda', 'itensVenda.produto', 'pagamentos', 'cliente', 'usuario'],
      });
    }).catch(err => {
      console.error('ERRO CRÍTICO NA VENDA DIRETA:', err);
      throw err;
    });
  }
}
