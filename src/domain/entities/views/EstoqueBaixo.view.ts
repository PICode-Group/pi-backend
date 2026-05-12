import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'vw_produtos_estoque_baixo',
  expression: `SELECT * FROM vw_produtos_estoque_baixo`
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
