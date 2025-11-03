# API de Gerenciamento de Eventos (Qualidade)

Este é o backend para a aplicação de Gerenciamento de Eventos, construído com Node.js, Express e MySQL. A API permite o gerenciamento de eventos, grupos de eventos e lida com uploads de imagens e documentos, com autenticação baseada em JWT para rotas administrativas.

## 🚀 Principais Funcionalidades

* **Autenticação:** Sistema de login para administradores com tokens JWT.
* **Gerenciamento de Eventos (CRUD):** Criação, Leitura, Atualização e Deleção (Soft Delete) de eventos.
* **Gerenciamento de Grupos (CRUD):** Criação, Leitura, Atualização e Deleção (Soft Delete) de grupos de eventos.
* **Upload de Mídia:** Suporte para upload de múltiplas imagens e documentos associados aos eventos.
* **Relacionamento:** Associação flexível de eventos a grupos.
* **Arquitetura Escalável:** Projeto estruturado no padrão **MVC (Model-View-Controller)** para facilitar a manutenção.

## 🛠️ Tecnologias Utilizadas

* **Backend:** Node.js, Express.js
* **Banco de Dados:** MySQL (com driver `mysql2`)
* **Autenticação:** JSON Web Token (JWT)
* **Upload de Arquivos:** Multer
* **Variáveis de Ambiente:** Dotenv

---

## 🏗️ Arquitetura do Projeto

O projeto segue o padrão **Model-View-Controller (MVC)** para garantir uma clara separação de responsabilidades.

```
/
├── assets/             # Arquivos estáticos (imagens, documentos)
├── config/
│   ├── database.js           # Configuração da conexão (Pool) com o MySQL
│   └── multer.js       # Configuração do Multer (upload de arquivos)
├── controllers/
│   ├── authController.js   # Lógica de negócio para autenticação
│   ├── eventController.js  # Lógica de negócio para eventos
│   └── groupController.js  # Lógica de negócio para grupos
├── middleware/
│   └── auth.js           # Middleware de autenticação (verifica JWT)
├── models/
│   ├── Event.js          # Modelo de dados (querys SQL) da tabela 'events'
│   └── Group.js          # Modelo de dados (querys SQL) da tabela 'event_groups'
├── routes/
│   ├── authRoutes.js     # Definição das rotas de autenticação (ex: /login)
│   ├── eventRoutes.js    # Definição das rotas de eventos (ex: /)
│   └── groupRoutes.js    # Definição das rotas de grupos (ex: /group)
├── .env                  # Arquivo para segredos (NÃO versionar no Git)
├── index.js              # Ponto de entrada principal do servidor Express
└── schema.sql            # Script SQL para criação das tabelas no MySQL
```

---

## 🏁 Instalação e Setup

Siga os passos abaixo para configurar e rodar o projeto localmente.

### 1. Pré-requisitos

* [Node.js](https://nodejs.org/) (v16 ou superior)
* Servidor [MySQL](https://www.mysql.com/) rodando

### 2. Instalação

1.  Clone este repositório (ou apenas crie os arquivos conforme a estrutura):
    ```bash
    git clone <url-do-repositorio>
    cd <nome-do-projeto>
    ```

2.  Instale as dependências do Node.js:
    ```bash
    npm install
    ```

### 3. Configuração do Banco de Dados

1.  Acesse seu servidor MySQL.
2.  Crie um novo banco de dados (ex: `qualidade`).
3.  Execute o script `schema.sql` (disponível na raiz do projeto) dentro desse banco de dados para criar as tabelas `events` e `event_groups`.

### 4. Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto e adicione as seguintes variáveis, substituindo pelos seus valores:

```ini
# Configuração do Banco de Dados
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=qualidade

# Segredo do JWT
JWT_SECRET=yourjwtsecret

# Porta da Aplicação
PORT=3472
```

### 5. Rodando o Servidor

Após concluir a instalação e configuração, inicie o servidor:

```bash
npm start
```

O servidor estará rodando em `http://localhost:3472`.

---

## 🔑 Autenticação

Rotas protegidas requerem um **Bearer Token** no cabeçalho `Authorization`.

1.  Envie uma requisição `POST` para `/login` com `username` e `password` de administrador.
2.  A API retornará um `token` JWT.
3.  Para acessar rotas protegidas, inclua o token no cabeçalho:
    `Authorization: Bearer <seu-token-aqui>`

---

## 🗺️ Documentação dos Endpoints (API)

### Autenticação

#### `POST /login`

* **Descrição:** Autentica um usuário administrador e retorna um token JWT.
* **Corpo (Body):**
    ```json
    {
      "username": "user",
      "password": "user123"
    }
    ```
* **Resposta (Sucesso 200):**
    ```json
    {
      "token": "eyJh...[token]...c4o"
    }
    ```

### Eventos (Events)

#### `GET /`

* **Descrição:** Lista todos os eventos ativos, com paginação.
* **Query Params:**
    * `page` (opcional): Número da página (padrão: 1).
    * `limit` (opcional): Itens por página (padrão: 10).
* **Protegido:** Não.

#### `GET /:id`

* **Descrição:** Busca um evento específico pelo seu ID.
* **Protegido:** Não.

#### `POST /`

* **Descrição:** Cria um novo evento. Requer `form-data` por causa dos uploads.
* **Protegido:** Sim (Admin).
* **Corpo (form-data):**
    * `name` (string, obrigatório)
    * `date_event` (string, obrigatório, ex: "YYYY-MM-DD")
    * `principal_photo` (int, obrigatório, índice da imagem principal no array `images`)
    * `images` (file, obrigatório, max: 10)
    * `description` (string, opcional)
    * `documents` (file, opcional, max: 10)
    * `group_id` (int, opcional, ID do grupo ao qual o evento pertence)

#### `PUT /:id`

* **Descrição:** Atualiza um evento existente. Requer `form-data` para gerenciar adição/remoção de arquivos.
* **Protegido:** Sim (Admin).
* **Corpo (form-data):**
    * `name` (string, opcional)
    * `description` (string, opcional)
    * `date_event` (string, opcional)
    * `principal_photo` (int, opcional)
    * `images` (file, opcional, *novas* imagens)
    * `documents` (file, opcional, *novos* documentos)
    * `removedImages` (string JSON, opcional, ex: `["./assets/uploads/img1.jpg"]`)
    * `removedDocuments` (string JSON, opcional, ex: `["./assets/documents/doc1.pdf"]`)

#### `DELETE /:id`

* **Descrição:** Realiza um "soft delete" do evento (define uma data de deleção, não remove do banco).
* **Protegido:** Sim (Admin).

### Grupos de Eventos (Event Groups)

#### `GET /group`

* **Descrição:** Lista todos os grupos de eventos ativos, com paginação. A resposta inclui um array `events` populado com os detalhes dos eventos associados.
* **Query Params:**
    * `page` (opcional): Número da página (padrão: 1).
    * `limit` (opcional): Itens por página (padrão: 10).
* **Protegido:** Não.

#### `GET /group/:id`

* **Descrição:** Busca um grupo específico pelo seu ID.
* **Protegido:** Não.

#### `POST /group`

* **Descrição:** Cria um novo grupo de eventos.
* **Protegido:** Sim (Admin).
* **Corpo (JSON):**
    ```json
    {
      "name": "Nome do Grupo",
      "description": "Descrição do grupo.",
      "events": [1, 2, 5] // Array de IDs de eventos (opcional)
    }
    ```

#### `PUT /group/:id`

* **Descrição:** Atualiza um grupo de eventos. Gerencia automaticamente a associação/desassociação de eventos.
* **Protegido:** Sim (Admin).
* **Corpo (JSON):**
    ```json
    {
      "name": "Novo Nome do Grupo",
      "description": "Nova descrição.",
      "events": [1, 3, 7] // O novo array completo de IDs de eventos
    }
    ```

#### `DELETE /group/:id`

* **Descrição:** Realiza um "soft delete" do grupo.
* **Protegido:** Sim (Admin).
```