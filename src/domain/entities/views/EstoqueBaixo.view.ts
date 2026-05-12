import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'vw_produtos_estoque_baixo',
  expression: `
    SELECT 
      p.id, 
      p.nome, 
      p.estoque as quantidade_atual, 
      p.estoque_minimo,
      c.nome as categoria
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.estoque <= p.estoque_minimo
  `
})
export class EstoqueBaixoView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  nome: string;

  @ViewColumn()
  quantidade_atual: number;

  @ViewColumn()
  estoque_minimo: number;

  @ViewColumn()
  categoria: string;
}
