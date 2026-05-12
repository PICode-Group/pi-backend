import { DataSource } from 'typeorm';
import { 
  UsuarioEntity, 
  CategoriaEntity, 
  FornecedorEntity, 
  ProdutoEntity, 
  EnderecoEntity,
  TipoUsuario,
  StatusUsuario
} from '../../domain/entities';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'itaprime',
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  synchronize: false,
});

async function runSeed() {
  await dataSource.initialize();
  console.log('Database connected for seeding...');

  // 1. Seed Usuários
  const userRepo = dataSource.getRepository(UsuarioEntity);
  const adminExists = await userRepo.findOneBy({ login: 'admin@itaprime.com' });
  
  if (!adminExists) {
    const admin = userRepo.create({
      id: uuid(),
      nome: 'Administrador',
      login: 'admin@itaprime.com',
      senha: await bcrypt.hash('admin123', 10),
      tipo: TipoUsuario.ADMIN,
      status: StatusUsuario.ATIVO,
    });
    await userRepo.save(admin);
    console.log('Admin user created');
  }

  // 2. Seed Categorias
  const catRepo = dataSource.getRepository(CategoriaEntity);
  const categories = ['Eletrônicos', 'Periféricos', 'Acessórios', 'Hardware'];
  for (const catName of categories) {
    const exists = await catRepo.findOneBy({ nome: catName });
    if (!exists) {
      await catRepo.save(catRepo.create({ nome: catName }));
      console.log(`Category ${catName} created`);
    }
  }

  // 3. Seed Fornecedores
  const fornRepo = dataSource.getRepository(FornecedorEntity);
  const endRepo = dataSource.getRepository(EnderecoEntity);
  
  const fornExists = await fornRepo.findOneBy({ cnpj: '12.345.678/0001-90' });
  if (!fornExists) {
    const endereco = await endRepo.save(endRepo.create({
      id: uuid(),
      rua: 'Rua dos Fornecedores',
      numero: '100',
      bairro: 'Industrial',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000'
    }));

    await fornRepo.save(fornRepo.create({
      id: uuid(),
      nome: 'Distribuidora Tech',
      cnpj: '12.345.678/0001-90',
      email: 'contato@distribuidoratech.com',
      telefone: '(11) 99999-9999',
      endereco: endereco
    }));
    console.log('Supplier Distribuidora Tech created');
  }

  // 4. Seed Produtos
  const prodRepo = dataSource.getRepository(ProdutoEntity);
  const prodExists = await prodRepo.findOneBy({ codigo_barras: '7891234567890' });
  if (!prodExists) {
    const hardwareCat = await catRepo.findOneBy({ nome: 'Hardware' });
    await prodRepo.save(prodRepo.create({
      id: uuid(),
      nome: 'Memória RAM 16GB DDR4',
      descricao: 'Memória RAM de alta performance',
      codigo_barras: '7891234567890',
      preco_custo: 250.00,
      preco_venda: 450.00,
      estoque: 20,
      estoque_minimo: 5,
      categoria: hardwareCat,
      imagem: 'uploads/placeholder.png'
    }));
    console.log('Product Memória RAM created');
  }

  await dataSource.destroy();
  console.log('Seeding completed!');
}

runSeed().catch(err => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
