import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'vw_produtos_mais_vendidos',
  expression: `SELECT * FROM vw_produtos_mais_vendidos`
})
export class ProdutosMaisVendidosView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  nome: string;

  @ViewColumn()
  total_quantidade: number;

  @ViewColumn()
  total_faturamento: number;

  @ViewColumn()
  numero_vendas: number;
}
