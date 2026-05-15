import { DataSource } from 'typeorm';
import { 
  UsuarioEntity, 
  CategoriaEntity, 
  FornecedorEntity, 
  ProdutoEntity, 
  EnderecoEntity,
  ClienteEntity,
  TipoUsuario,
  StatusUsuario
} from '../../domain/entities';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME ,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../../domain/entities/*.entity{.ts,.js}'],
  synchronize: false,
  ssl:{
    rejectUnauthorized: false
  }
});

async function runSeed() {
  await dataSource.initialize();
  console.log('Database connected for seeding...');

  // 1. Seed Usuários (10 registros)
  const userRepo = dataSource.getRepository(UsuarioEntity);
  const senhaPlana = 'admin12345678';
  
  const usersData = [
    { nome: 'Administrador', login: 'admin@itaprime.com', tipo: TipoUsuario.ADMIN },
    { nome: 'João Vendedor', login: 'joao@itaprime.com', tipo: TipoUsuario.VENDEDOR },
    { nome: 'Maria Vendas', login: 'maria@itaprime.com', tipo: TipoUsuario.VENDEDOR },
    { nome: 'Pedro Estoque', login: 'pedro@itaprime.com', tipo: TipoUsuario.VENDEDOR },
    { nome: 'Ana Gerente', login: 'ana@itaprime.com', tipo: TipoUsuario.ADMIN },
    { nome: 'Carlos Silva', login: 'carlos@itaprime.com', tipo: TipoUsuario.VENDEDOR },
    { nome: 'Julia Souza', login: 'julia@itaprime.com', tipo: TipoUsuario.VENDEDOR },
    { nome: 'Ricardo Lima', login: 'ricardo@itaprime.com', tipo: TipoUsuario.VENDEDOR },
    { nome: 'Fernanda Oliveira', login: 'fernanda@itaprime.com', tipo: TipoUsuario.VENDEDOR },
    { nome: 'Lucas Santos', login: 'lucas@itaprime.com', tipo: TipoUsuario.VENDEDOR },
  ];

  for (const u of usersData) {
    let user = await userRepo.findOneBy({ login: u.login });
    
    if (user) {
      user.senha = senhaPlana;
      user.status = StatusUsuario.ATIVO;
      user.nome = u.nome;
      user.tipo = u.tipo;
      await userRepo.save(user);
      console.log(`User ${u.nome} updated (password synced)`);
    } else {
      await userRepo.save(userRepo.create({
        id: uuid(),
        ...u,
        senha: senhaPlana,
        status: StatusUsuario.ATIVO,
      }));
      console.log(`User ${u.nome} created`);
    }
  }

  // 2. Seed Categorias (10 registros)
  const catRepo = dataSource.getRepository(CategoriaEntity);
  const categories = [
    'Eletrônicos', 'Periféricos', 'Acessórios', 'Hardware', 
    'Monitores', 'Cadeiras Gamer', 'Teclados', 'Mouses', 
    'Áudio', 'Armazenamento'
  ];
  for (const catName of categories) {
    const exists = await catRepo.findOneBy({ nome: catName });
    if (!exists) {
      await catRepo.save(catRepo.create({ nome: catName }));
      console.log(`Category ${catName} created`);
    }
  }

  // 3. Seed Fornecedores (10 registros)
  const fornRepo = dataSource.getRepository(FornecedorEntity);
  const endRepo = dataSource.getRepository(EnderecoEntity);
  
  const suppliersData = [
    { nome: 'Distribuidora Tech', cnpj: '12.345.678/0001-90', email: 'contato@disttech.com' },
    { nome: 'Logística Global', cnpj: '22.345.678/0001-91', email: 'vendas@logglobal.com' },
    { nome: 'Importadora Express', cnpj: '32.345.678/0001-92', email: 'sac@importexpress.com' },
    { nome: 'Mega Hardware', cnpj: '42.345.678/0001-93', email: 'mega@hardware.com' },
    { nome: 'Forncecedora Alfa', cnpj: '52.345.678/0001-94', email: 'alfa@forn.com' },
    { nome: 'Beta Suprimentos', cnpj: '62.345.678/0001-95', email: 'beta@supri.com' },
    { nome: 'Gama Peças', cnpj: '72.345.678/0001-96', email: 'gama@pecas.com' },
    { nome: 'Delta Componentes', cnpj: '82.345.678/0001-97', email: 'delta@comp.com' },
    { nome: 'Zeta Imports', cnpj: '92.345.678/0001-98', email: 'zeta@imports.com' },
    { nome: 'Sigma Eletrônicos', cnpj: '02.345.678/0001-99', email: 'sigma@eletr.com' },
  ];

  for (const f of suppliersData) {
    const exists = await fornRepo.findOneBy({ cnpj: f.cnpj });
    if (!exists) {
      const endereco = await endRepo.save(endRepo.create({
        id: uuid(),
        rua: 'Avenida Comercial',
        numero: Math.floor(Math.random() * 1000).toString(),
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000'
      }));

      await fornRepo.save(fornRepo.create({
        id: uuid(),
        ...f,
        telefone: '(11) 9' + Math.floor(10000000 + Math.random() * 90000000),
        endereco: endereco
      }));
      console.log(`Supplier ${f.nome} created`);
    }
  }

  // 4. Seed Produtos (10 registros)
  const prodRepo = dataSource.getRepository(ProdutoEntity);
  const hardwareCat = await catRepo.findOneBy({ nome: 'Hardware' });
  const perifCat = await catRepo.findOneBy({ nome: 'Periféricos' });

  const productsData = [
    { nome: 'Memória RAM 16GB DDR4', preco_custo: 250, preco_venda: 450, codigo_barras: '7891234567890', categoria: hardwareCat },
    { nome: 'SSD 480GB SATA', preco_custo: 150, preco_venda: 300, codigo_barras: '7891234567891', categoria: hardwareCat },
    { nome: 'Mouse Gamer RGB', preco_custo: 40, preco_venda: 120, codigo_barras: '7891234567892', categoria: perifCat },
    { nome: 'Teclado Mecânico', preco_custo: 120, preco_venda: 350, codigo_barras: '7891234567893', categoria: perifCat },
    { nome: 'Processador i5 12th', preco_custo: 800, preco_venda: 1400, codigo_barras: '7891234567894', categoria: hardwareCat },
    { nome: 'Placa de Vídeo RTX 3060', preco_custo: 1500, preco_venda: 2800, codigo_barras: '7891234567895', categoria: hardwareCat },
    { nome: 'Monitor 24" 144Hz', preco_custo: 600, preco_venda: 1100, codigo_barras: '7891234567896', categoria: await catRepo.findOneBy({ nome: 'Monitores' }) },
    { nome: 'Headset 7.1', preco_custo: 100, preco_venda: 250, codigo_barras: '7891234567897', categoria: await catRepo.findOneBy({ nome: 'Áudio' }) },
    { nome: 'Cadeira Gamer Black', preco_custo: 400, preco_venda: 900, codigo_barras: '7891234567898', categoria: await catRepo.findOneBy({ nome: 'Cadeiras Gamer' }) },
    { nome: 'Fonte 600W 80 Plus', preco_custo: 200, preco_venda: 380, codigo_barras: '7891234567899', categoria: hardwareCat },
  ];

  for (const p of productsData) {
    const exists = await prodRepo.findOneBy({ codigo_barras: p.codigo_barras });
    if (!exists) {
      await prodRepo.save(prodRepo.create({
        id: uuid(),
        ...p,
        descricao: `Descrição do produto ${p.nome}`,
        estoque: 50,
        estoque_minimo: 10,
        imagem: 'uploads/placeholder.png'
      }));
      console.log(`Product ${p.nome} created`);
    }
  }

  // 5. Seed Clientes (10 registros)
  const clienteRepo = dataSource.getRepository(ClienteEntity);
  const clientesData = [
    { nome: 'Consumidor Final', cpf: '000.000.000-00', email: 'balcao@email.com' },
    { nome: 'Ana Paula Souza', cpf: '111.222.333-44', email: 'ana.souza@email.com' },
    { nome: 'Bruno Ferreira', cpf: '222.333.444-55', email: 'bruno.f@email.com' },
    { nome: 'Carla Dias', cpf: '333.444.555-66', email: 'carla.dias@email.com' },
    { nome: 'Diego Santos', cpf: '444.555.666-77', email: 'diego.s@email.com' },
    { nome: 'Elaine Lima', cpf: '555.666.777-88', email: 'elaine.lima@email.com' },
    { nome: 'Fabio Junior', cpf: '666.777.888-99', email: 'fabio.j@email.com' },
    { nome: 'Gisele Bündchen', cpf: '777.888.999-00', email: 'gisele@email.com' },
    { nome: 'Hugo Souza', cpf: '888.999.000-11', email: 'hugo.souza@email.com' },
    { nome: 'Igor Gomes', cpf: '999.000.111-22', email: 'igor.g@email.com' },
  ];

  for (const c of clientesData) {
    const exists = await clienteRepo.findOneBy({ cpf: c.cpf });
    if (!exists) {
      await clienteRepo.save(clienteRepo.create({
        id: uuid(),
        ...c,
        telefone: '(11) 9' + Math.floor(10000000 + Math.random() * 90000000),
      }));
      console.log(`Client ${c.nome} created`);
    }
  }

  await dataSource.destroy();
  console.log('Seeding completed!');
}

runSeed().catch(err => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
