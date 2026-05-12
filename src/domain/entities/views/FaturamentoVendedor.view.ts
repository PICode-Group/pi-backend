import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'vw_faturamento_por_vendedor',
  expression: `
    SELECT 
      u.id,
      u.nome as vendedor,
      COUNT(v.id) as total_vendas,
      SUM(v.valor_total - v.desconto) as total_faturado
    FROM vendas v
    JOIN usuarios u ON v.usuario_id = u.id
    WHERE v.status = 'PAGA' OR v.status = 'FINALIZADA'
    GROUP BY u.id, u.nome
    ORDER BY total_faturado DESC
  `
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
