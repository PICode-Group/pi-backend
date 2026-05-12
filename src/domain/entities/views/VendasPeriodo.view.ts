import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'vw_vendas_por_periodo',
  expression: `SELECT * FROM vw_vendas_por_periodo`
})
export class VendasPeriodoView {
  @ViewColumn()
  data: Date;

  @ViewColumn()
  total_vendas: number;

  @ViewColumn()
  faturamento_bruto: number;

  @ViewColumn()
  total_descontos: number;

  @ViewColumn()
  faturamento_liquido: number;
}
