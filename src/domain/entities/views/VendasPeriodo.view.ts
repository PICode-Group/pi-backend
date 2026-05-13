import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'vw_vendas_por_periodo',
  expression: `
    SELECT 
      DATE(v.data_venda) as data,
      COUNT(v.id) as total_vendas,
      SUM(v.valor_total) as faturamento_bruto,
      SUM(v.desconto) as total_descontos,
      SUM(v.valor_total - v.desconto) as faturamento_liquido
    FROM vendas v
    WHERE v.status = 'PAGA' OR v.status = 'FINALIZADA'
    GROUP BY DATE(v.data_venda)
    ORDER BY DATE(v.data_venda) DESC
  `
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
