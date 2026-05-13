# ItaPrime ERP - Backend (MVP Concluído)

Bem-vindo ao repositório do backend do **ItaPrime ERP**. Este projeto é uma solução completa para gestão de micro e pequenas empresas, focada em controle de estoque, motor de vendas e inteligência de dados.

## Arquitetura do Projeto

O sistema foi desenvolvido utilizando o framework **NestJS** sob uma **Arquitetura Modular (Vertical)**. Esta abordagem garante que cada domínio de negócio seja independente, facilitando a manutenção e a escalabilidade.

- **`src/modules`**: Contém todos os domínios de negócio (Vendas, Estoque, Produtos, etc.).
- **`src/core`**: Centraliza componentes globais como Filtros de Exceção, Interceptors de Auditoria, Guards de Segurança e Decoradores.
- **`src/domain`**: Define as Entidades globais que mapeiam o banco de dados.
- **`src/config`**: Centraliza as configurações de ambiente e conexão com o banco de dados.

---

## Tecnologias Utilizadas

- **NestJS v11**: Framework Node.js progressivo para aplicações escaláveis.
- **TypeORM**: ORM para integração robusta com o banco de dados MySQL.
- **Zod & Nestjs-Zod**: Validação de dados e tipagem forte para DTOs.
- **Passport & JWT**: Segurança e autenticação baseada em tokens.
- **Swagger**: Documentação interativa da API.

---

## Segurança e Controle de Acesso (RBAC)

O sistema utiliza controle de acesso baseado em cargos (**Roles**). Os níveis de permissão são:

1.  **ADMIN**: Acesso total ao sistema, incluindo gestão de usuários, logs de auditoria, configurações da empresa e relatórios financeiros sensíveis.
2.  **VENDEDOR**: Acesso operacional para realizar vendas, consultar produtos e visualizar estoque.

**Recursos Protegidos:**
- O acesso a `/usuarios`, `/logs` e `/relatorios/vendas-periodo` é restrito a **ADMIN**.

---

##  Módulos Principais

### 🛒 Vendas e Pagamentos
- Motor de vendas com suporte a **Venda Direta** (PDV).
- Cálculo automático de subtotais, descontos e valores totais.
- Gestão de múltiplos pagamentos por venda.
- Status de venda: `ABERTA`, `PAGA`, `CANCELADA`.

### Controle de Estoque
- Registro de entradas com atualização automática de saldo e custo.
- **RN: Impedimento de estoque negativo** em todas as transações de venda.
- Devolução automática de produtos ao estoque em caso de cancelamento de venda.

### 📊 Inteligência de Dados (Views)
Relatórios nativos baseados em Database Views otimizadas:
- Produtos com estoque baixo.
- Ranking de produtos mais vendidos.
- Performance de vendas por período e por vendedor.

### 📝 Auditoria (Logs)
Todo o sistema é monitorado por um **Audit Interceptor** que registra:
- Quem realizou a ação (ID do usuário).
- Qual foi a ação (Método e Recurso).
- Payload da requisição para rastreabilidade total.

---

## Como Rodar o Projeto

### Pré-requisitos
- Node.js (v20+)
- MySQL (v8+)

### Instalação
1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env` (use o `.env.example` como base).
4. Inicialize o banco de dados e as views:
   ```bash
   npm run views
   ```

### Execução
```bash
# Modo desenvolvimento (com hot-reload)
npm run dev

# Modo produção
npm run build
npm run start:prod
```

### Documentação da API
Após iniciar o servidor, acesse a documentação interativa em:
`http://localhost:3000/api`

---

## 📄 Licença
Este projeto é de uso exclusivo para fins de integração e desenvolvimento privado.
