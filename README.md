### 🔵 Sprint 0 – Configuração e Autenticação (Fundação)

|ID|Funcionalidade|Descrição|Endpoint|
|---|---|---|---|
|A1|Login de usuário|Autenticar com login/senha, retornar token|`POST /auth/login`|
|A2|CRUD de usuários|Cadastrar, listar, editar, excluir usuários (admin only)|`GET/POST/PUT/DELETE /usuarios`|
|A3|Dados da empresa|Obter/editar informações da loja|`GET/PUT /empresa`|
|A4|Logs do sistema|Listar logs com filtros (usuário, ação, data)|`GET /logs`|

---

### 🟢 Sprint 1 – Cadastro Base (Essencial)

|ID|Funcionalidade|Descrição|Endpoint|
|---|---|---|---|
|C1|CRUD de categorias|Cadastrar, listar, editar, excluir categorias|`GET/POST/PUT/DELETE /categorias`|
|C2|CRUD de clientes|Com endereço integrado|`GET/POST/PUT/DELETE /clientes`|
|C3|CRUD de fornecedores|Com endereço integrado|`GET/POST/PUT/DELETE /fornecedores`|
|C4|CRUD de produtos|Com categoria, preços, estoque inicial, código de barras|`GET/POST/PUT/DELETE /produtos`|
|C5|Filtros em produtos|Por nome, categoria, estoque baixo, código de barras|`GET /produtos?filtros...`|
|C6|Upload de imagem|Para produtos|`POST /produtos/{id}/imagem`|

---

### 🟡 Sprint 2 – Estoque (Controle avançado)

|ID|Funcionalidade|Descrição|Endpoint|
|---|---|---|---|
|E1|Registrar entrada de estoque|Compra/devolução/ajuste de produtos|`POST /entradas-estoque`|
|E2|Listar entradas de estoque|Com filtros por fornecedor, data, tipo|`GET /entradas-estoque`|
|E3|Consultar estoque atual do produto|Retornar quantidade + estoque mínimo|`GET /produtos/{id}/estoque`|
|E4|Produtos com estoque baixo|Usar view `vw_produtos_estoque_baixo`|`GET /relatorios/estoque-baixo`|
|E5|Histórico de movimentação|Todas as entradas e saídas de um produto|`GET /produtos/{id}/movimentacoes`|

---

### 🟠 Sprint 3 – Vendas e Pagamentos (Core business)

|ID|Funcionalidade|Descrição|Endpoint|
|---|---|---|---|
|V1|Abrir nova venda|Criar venda com status "ABERTA"|`POST /vendas`|
|V2|Adicionar item à venda|Inserir produto na venda aberta|`POST /vendas/{id}/itens`|
|V3|Remover item da venda|Remover produto da venda|`DELETE /vendas/{id}/itens/{itemId}`|
|V4|Aplicar desconto|Na venda atual|`PATCH /vendas/{id}/desconto`|
|V5|Finalizar venda|Mudar status para "PAGA", baixar estoque|`POST /vendas/{id}/finalizar`|
|V6|Cancelar venda|Mudar status para "CANCELADA", devolver estoque|`POST /vendas/{id}/cancelar`|
|V7|Registrar pagamento|Um ou mais pagamentos por venda|`POST /vendas/{id}/pagamentos`|
|V8|Listar vendas|Com filtros por data, cliente, status|`GET /vendas`|
|V9|Consultar venda completa|Dados da venda + itens + pagamentos|`GET /vendas/{id}`|

---

### 🔴 Sprint 4 – Relatórios e Views (Inteligência)

|ID|Funcionalidade|Descrição|Endpoint (baseado nas suas views)|
|---|---|---|---|
|R1|Produtos mais vendidos|View `vw_produtos_mais_vendidos`|`GET /relatorios/mais-vendidos`|
|R2|Total vendido por dia|View `vw_total_vendido_por_dia`|`GET /relatorios/vendas-por-dia`|
|R3|Total vendido por mês|View `vw_total_vendido_por_mes`|`GET /relatorios/vendas-por-mes`|
|R4|Vendas completas|View `vw_vendas_completas`|`GET /relatorios/vendas-completas`|
|R5|Vendas finalizadas|View `vw_vendas_finalizadas`|`GET /relatorios/vendas-finalizadas`|
|R6|Comprovante de venda|View `vw_comprovante_venda` + `vw_itens_vendidos`|`GET /relatorios/comprovante/{vendaId}`|

---

### 🟣 Sprint 5 – Regras de Negócio e Validações

| ID  | Regra                  | Descrição                                                        |     |
| --- | ---------------------- | ---------------------------------------------------------------- | --- |
| RN1 | Estoque negativo       | Impedir venda se quantidade > estoque disponível                 |     |
| RN2 | Baixa automática       | Ao finalizar venda, reduzir `produtos.estoque`                   |     |
| RN3 | Devolução automática   | Ao cancelar venda, restaurar `produtos.estoque`                  |     |
| RN4 | Preço de venda         | Usar `preco_venda` do produto no momento do item                 |     |
| RN5 | Cálculo do subtotal    | `quantidade * preco_unitario`                                    |     |
| RN6 | Cálculo do valor_total | Soma dos subtotais dos itens - desconto                          |     |
| RN7 | Log de ações           | Registrar no `logs` toda criação/edição/exclusão relevante       |     |
| RN8 | Permissões             | Apenas ADMIN pode acessar logs, usuários, relatórios financeiros |     |
