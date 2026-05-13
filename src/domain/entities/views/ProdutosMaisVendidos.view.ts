import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'vw_produtos_mais_vendidos',
  expression: `
    SELECT 
      p.id,
      p.nome,
      SUM(iv.quantidade) as total_quantidade,
      SUM(iv.subtotal) as total_faturamento,
      COUNT(DISTINCT v.id) as numero_vendas
    FROM itens_venda iv
    JOIN produtos p ON iv.produto_id = p.id
    JOIN vendas v ON iv.venda_id = v.id
    WHERE v.status = 'PAGA' OR v.status = 'FINALIZADA'
    GROUP BY p.id, p.nome
    ORDER BY total_quantidade DESC
  `
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
