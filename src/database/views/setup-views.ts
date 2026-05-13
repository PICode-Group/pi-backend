import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'itaprime',
});

async function setupViews() {
  await dataSource.initialize();
  console.log('Conectado ao banco para configurar Views...');

  const queryRunner = dataSource.createQueryRunner();

  // 1. View: Produtos com estoque baixo
  await queryRunner.query(`
    CREATE OR REPLACE VIEW vw_produtos_estoque_baixo AS
    SELECT 
      p.id, 
      p.nome, 
      p.estoque as quantidade_atual, 
      p.estoque_minimo,
      c.nome as categoria
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.estoque <= p.estoque_minimo;
  `);
  console.log('View vw_produtos_estoque_baixo criada!');

  // 2. View: Vendas por Período
  await queryRunner.query(`
    CREATE OR REPLACE VIEW vw_vendas_por_periodo AS
    SELECT 
      DATE(v.data_venda) as data,
      COUNT(v.id) as total_vendas,
      SUM(v.valor_total) as faturamento_bruto,
      SUM(v.desconto) as total_descontos,
      SUM(v.valor_total - v.desconto) as faturamento_liquido
    FROM vendas v
    WHERE v.status = 'PAGA' OR v.status = 'FINALIZADA'
    GROUP BY DATE(v.data_venda)
    ORDER BY DATE(v.data_venda) DESC;
  `);
  console.log('View vw_vendas_por_periodo criada!');

  // 3. View: Produtos Mais Vendidos
  await queryRunner.query(`
    CREATE OR REPLACE VIEW vw_produtos_mais_vendidos AS
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
    ORDER BY total_quantidade DESC;
  `);
  console.log('View vw_produtos_mais_vendidos criada!');

  // 4. View: Faturamento por Vendedor
  await queryRunner.query(`
    CREATE OR REPLACE VIEW vw_faturamento_por_vendedor AS
    SELECT 
      u.id,
      u.nome as vendedor,
      COUNT(v.id) as total_vendas,
      SUM(v.valor_total - v.desconto) as total_faturado
    FROM vendas v
    JOIN usuarios u ON v.usuario_id = u.id
    WHERE v.status = 'PAGA' OR v.status = 'FINALIZADA'
    GROUP BY u.id, u.nome
    ORDER BY total_faturado DESC;
  `);
  console.log('View vw_faturamento_por_vendedor criada!');

  await dataSource.destroy();
  console.log('Configuração de Views finalizada com sucesso!');
}

setupViews().catch(err => {
  console.error('Erro ao configurar views:', err);
  process.exit(1);
});
