import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'vw_faturamento_por_vendedor',
  expression: `SELECT * FROM vw_faturamento_por_vendedor`
})
export class FaturamentoVendedorView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  vendedor: string;

  @ViewColumn()
  total_vendas: number;

  @ViewColumn()
  total_faturado: number;
}
