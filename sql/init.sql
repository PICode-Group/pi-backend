DROP DATABASE IF EXISTS itaprime;
CREATE DATABASE itaprime;
USE itaprime;

-- ========================
-- ENDEREÇOS
-- ========================
CREATE TABLE enderecos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rua VARCHAR(100),
  numero VARCHAR(10),
  bairro VARCHAR(60),
  cidade VARCHAR(60),
  estado VARCHAR(2),
  cep VARCHAR(10)
);

-- ========================
-- EMPRESA
-- ========================
CREATE TABLE empresa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_fantasia VARCHAR(100) NOT NULL,
  razao_social VARCHAR(120),
  cnpj VARCHAR(18),
  telefone VARCHAR(20),
  email VARCHAR(100),
  endereco_id INT,
  FOREIGN KEY (endereco_id) REFERENCES enderecos(id)
);

-- ========================
-- CLIENTES
-- ========================
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14),  
  telefone VARCHAR(20),
  email VARCHAR(100),
  endereco_id INT,
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (cpf),
  FOREIGN KEY (endereco_id) REFERENCES enderecos(id)
);

-- ========================
-- FORNECEDORES
-- ========================
CREATE TABLE fornecedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cnpj VARCHAR(18),
  telefone VARCHAR(20),
  email VARCHAR(100),
  endereco_id INT,
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (cnpj),
  FOREIGN KEY (endereco_id) REFERENCES enderecos(id)
);

-- ========================
-- USUÁRIOS
-- ========================
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  login VARCHAR(50) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('ADMIN','VENDEDOR') NOT NULL,
  status ENUM('ATIVO','INATIVO') DEFAULT 'ATIVO',
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- CATEGORIAS
-- ========================
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL UNIQUE
);

-- ========================
-- PRODUTOS
-- ========================
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  codigo_barras VARCHAR(50) UNIQUE,
  categoria_id INT,
  preco_custo DECIMAL(10,2) NOT NULL,
  preco_venda DECIMAL(10,2) NOT NULL,
  estoque INT NOT NULL DEFAULT 0,
  estoque_minimo INT DEFAULT 0,
  imagem VARCHAR(255),
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- ========================
-- VENDAS
-- ========================
CREATE TABLE vendas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  usuario_id INT NOT NULL,
  data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
  desconto DECIMAL(10,2) DEFAULT 0,
  valor_total DECIMAL(10,2) DEFAULT 0,
  status ENUM('ABERTA','PAGA','CANCELADA') DEFAULT 'ABERTA',
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ========================
-- ITENS DA VENDA
-- ========================
CREATE TABLE itens_venda (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venda_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (venda_id) REFERENCES vendas(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- ========================
-- PAGAMENTOS
-- ========================
CREATE TABLE pagamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venda_id INT NOT NULL,
  tipo ENUM('DINHEIRO','PIX','DEBITO','CREDITO') NOT NULL,
  valor_pago DECIMAL(10,2) NOT NULL,
  data_pagamento DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venda_id) REFERENCES vendas(id)
);

-- ========================
-- ENTRADAS DE ESTOQUE
-- ========================
CREATE TABLE entradas_estoque (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fornecedor_id INT,
  usuario_id INT NOT NULL,
  data_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,
  tipo ENUM('COMPRA','DEVOLUCAO','AJUSTE') DEFAULT 'COMPRA',
  valor_total DECIMAL(10,2),
  observacao VARCHAR(200),
  FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ========================
-- ITENS DA ENTRADA
-- ========================
CREATE TABLE itens_entrada (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entrada_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_custo DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (entrada_id) REFERENCES entradas_estoque(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- ========================
-- LOGS
-- ========================
CREATE TABLE logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  acao VARCHAR(100) NOT NULL,
  descricao VARCHAR(255),
  data_log DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ========================
-- VIEWS
-- ========================

CREATE OR REPLACE VIEW vw_comprovante_venda AS
SELECT 
  v.id AS id_venda,
  v.data_venda,
  e.nome_fantasia AS loja,
  c.nome AS cliente,
  u.nome AS vendedor,
  v.desconto,
  v.valor_total
FROM vendas v
LEFT JOIN clientes c ON v.cliente_id = c.id
JOIN usuarios u ON v.usuario_id = u.id
JOIN empresa e ON e.id = 1;

CREATE OR REPLACE VIEW vw_itens_vendidos AS
SELECT 
  iv.venda_id,
  p.nome AS produto,
  p.imagem,
  cat.nome AS categoria,
  iv.quantidade,
  iv.preco_unitario,
  iv.subtotal
FROM itens_venda iv
JOIN produtos p ON iv.produto_id = p.id
LEFT JOIN categorias cat ON p.categoria_id = cat.id;

CREATE OR REPLACE VIEW vw_produtos_estoque_baixo AS
SELECT 
  id,
  nome,
  imagem,
  estoque,
  estoque_minimo
FROM produtos
WHERE estoque <= estoque_minimo;

CREATE OR REPLACE VIEW vw_produtos_mais_vendidos AS
SELECT 
  p.id,
  p.nome AS produto,
  p.imagem,
  SUM(iv.quantidade) AS total_vendido
FROM itens_venda iv
JOIN produtos p ON iv.produto_id = p.id
GROUP BY p.id, p.nome, p.imagem
ORDER BY total_vendido DESC;

CREATE OR REPLACE VIEW vw_total_vendido_por_dia AS
SELECT 
  DATE(v.data_venda) AS dia,
  SUM(v.valor_total) AS total_vendido
FROM vendas v
GROUP BY DATE(v.data_venda)
ORDER BY dia DESC;

CREATE OR REPLACE VIEW vw_total_vendido_por_mes AS
SELECT 
  DATE_FORMAT(v.data_venda, '%Y-%m') AS mes,
  SUM(v.valor_total) AS total_vendido
FROM vendas v
GROUP BY DATE_FORMAT(v.data_venda, '%Y-%m')
ORDER BY mes DESC;

CREATE OR REPLACE VIEW vw_vendas_completas AS
SELECT 
  v.id AS id_venda,
  v.data_venda,
  v.valor_total,
  v.desconto,
  c.nome AS cliente,
  u.nome AS vendedor
FROM vendas v
LEFT JOIN clientes c ON v.cliente_id = c.id
JOIN usuarios u ON v.usuario_id = u.id;

CREATE OR REPLACE VIEW vw_vendas_finalizadas AS
SELECT 
  v.id AS id_venda,
  v.data_venda,
  v.valor_total,
  v.status,
  c.nome AS cliente,
  u.nome AS vendedor
FROM vendas v
LEFT JOIN clientes c ON v.cliente_id = c.id
JOIN usuarios u ON v.usuario_id = u.id
WHERE v.status = 'PAGA';