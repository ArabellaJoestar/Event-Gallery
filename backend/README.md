# Event Gallery - Backend API

Servidor backend para gerenciamento de eventos, grupos e upload de arquivos, construído com Express.js e MySQL.

## Índice

- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando a Aplicação](#executando-a-aplicação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Autenticação](#autenticação)
- [Esquema do Banco de Dados](#esquema-do-banco-de-dados)
- [Upload de Arquivos](#upload-de-arquivos)
- [Deploy com Docker](#deploy-com-docker)
- [Tratamento de Erros](#tratamento-de-erros)
- [Contribuindo](#contribuindo)

## Funcionalidades

- Gerenciamento de Eventos: Criar, ler, atualizar e deletar eventos
- Gerenciamento de Grupos: Organizar eventos em grupos
- Autenticação de Usuários: Autenticação baseada em JWT com papéis de usuário
- Upload de Arquivos: Suporte para imagens, documentos e vídeos
- API Segura: Endpoints protegidos com middleware JWT
- Transações de Banco de Dados: Operações atômicas para consistência de dados
- CORS Habilitado: Suporte para requisições cross-origin
- Servir Arquivos Estáticos: Servir assets através da API
- Pronto para Docker: Suporte para deploy containerizado

## Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- npm ou pnpm como gerenciador de pacotes
- Docker (opcional, para deploy containerizado)

## Instalação

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd backend
```

### 2. Instalar Dependências

Usando npm:
```bash
npm install
```

Ou usando pnpm:
```bash
pnpm install
```

### 3. Visão Geral das Dependências

As seguintes dependências são utilizadas neste projeto:

- **express** (^4.18.2): Framework web para criar a API
- **cors** (^2.8.5): Permite comunicação entre frontend e backend em domínios diferentes
- **dotenv** (^17.2.3): Carrega variáveis de ambiente do arquivo .env
- **mysql2** (^3.15.3): Driver para conectar ao banco de dados MySQL
- **jsonwebtoken** (^9.0.2): Cria e verifica tokens JWT para autenticação
- **bcryptjs** (^3.0.3): Hash de senhas para segurança
- **multer** (^2.0.0): Middleware para processar upload de arquivos

## Configuração

### 1. Criar Arquivo de Variáveis de Ambiente

Crie um arquivo chamado `.env` no diretório raiz com as seguintes variáveis:

```env
# Configuração do Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=events_database

# Configuração do JWT
JWT_SECRET=sua_chave_secreta

# Configuração do Servidor
PORT=3472
```

Essas variáveis controlam como o servidor se conecta ao MySQL e como os tokens de autenticação são gerados.

### 2. Configurar o Banco de Dados

Execute o script SQL de inicialização para criar as tabelas necessárias. O arquivo está localizado em `init_scripts/schema.sql`.

Para executar o script no MySQL, use o comando:

```bash
mysql -u root -p events_database < init_scripts/schema.sql
```

Este comando irá:
- Criar a tabela de usuários
- Criar a tabela de eventos
- Criar a tabela de grupos
- Estabelecer relacionamentos entre as tabelas

### 3. Criar Diretórios para Assets

O aplicativo precisa de diretórios específicos para armazenar os arquivos enviados:

```
backend/
├── assets/
│   ├── images/
│   ├── documents/
│   └── videos/
```

Estes diretórios são automaticamente criados quando o servidor inicia pela primeira vez. Se isso não acontecer, crie-os manualmente.

## Executando a Aplicação

### Modo Desenvolvimento

Para executar a aplicação em modo desenvolvimento com monitoramento de arquivos (recarrega automaticamente quando você faz mudanças):

```bash
npm run dev
```

Ou usando pnpm:
```bash
pnpm dev
```

### Modo Produção

Para executar a aplicação em modo produção:

```bash
npm start
```

O servidor irá iniciar na porta 3472 (ou na porta especificada no arquivo `.env`).

Você deve ver uma saída similar a esta:

```
Servindo arquivos estáticos de: /app/assets
Conexão com a base de dados estabelecida
Servidor rodando na porta 3472
```

Isso significa que o servidor está funcionando corretamente e pronto para receber requisições.

### Usando Script em Lote (Windows)

Se você está no Windows, pode usar o script em lote fornecido:

```bash
start_api_server.bat
```

Este script iniciará o servidor automaticamente.

## Estrutura do Projeto

Aqui está a organização dos arquivos e pastas do backend:

```
backend/
├── config/
│   ├── database.js          # Pool de conexões MySQL
│   └── multer.js            # Configuração de upload de arquivos
├── controllers/
│   ├── authController.js    # Lógica de autenticação
│   ├── eventController.js   # Operações CRUD de eventos
│   └── groupController.js   # Operações CRUD de grupos
├── middlewares/
│   └── auth.js              # Middleware de autenticação JWT
├── models/
│   ├── User.js              # Modelo de dados de usuário
│   ├── Event.js             # Modelo de dados de evento
│   └── Group.js             # Modelo de dados de grupo
├── routes/
│   ├── authRoutes.js        # Endpoints de autenticação
│   ├── eventRoutes.js       # Endpoints de eventos
│   └── groupRoutes.js       # Endpoints de grupos
├── assets/
│   ├── images/              # Imagens enviadas por upload
│   ├── documents/           # Documentos enviados por upload
│   └── videos/              # Vídeos enviados por upload
├── logfiles/                # Logs da aplicação
├── index.js                 # Ponto de entrada da aplicação
├── package.json             # Dependências do projeto
├── Dockerfile               # Configuração para Docker
└── .env                     # Variáveis de ambiente (não versionar)
```

Cada pasta tem uma responsabilidade específica:

- **config**: Configurações gerais como banco de dados e upload
- **controllers**: Lógica de negócio para cada funcionalidade
- **middlewares**: Funções que interceptam requisições (como autenticação)
- **models**: Comunicação com o banco de dados
- **routes**: Definição de quais URLs estão disponíveis
- **assets**: Armazenamento de arquivos enviados pelos usuários

## Endpoints da API

A seguir, você encontra a documentação completa de todos os endpoints disponíveis na API.

### Autenticação

#### Login
- **Método HTTP**: POST
- **URL**: `/login`
- **Descrição**: Faz o login do usuário e retorna um token JWT para fazer requisições autenticadas
- **Precisa de Autenticação**: Não
- **Corpo da Requisição**:
  ```json
  {
    "username": "admin",
    "password": "senha123"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Códigos de Status**: 
  - 200 (Sucesso)
  - 401 (Credenciais inválidas)
  - 500 (Erro no servidor)

Guarde o token retornado para usar nas requisições autenticadas. Ele deve ser enviado no header `Authorization` com o prefixo `Bearer`.

---

### Eventos

#### Obter Todos os Eventos
- **Método HTTP**: GET
- **URL**: `/`
- **Descrição**: Retorna uma lista de todos os eventos
- **Precisa de Autenticação**: Não
- **Resposta de Sucesso**:
  ```json
  [
    {
      "id": 1,
      "id_req": "REQ-1703001234567",
      "name": "Festa de Aniversário",
      "description": "Evento de celebração",
      "principal_photo": "/assets/images/photo.jpg",
      "date_event": "2024-12-25",
      "date_creation": "2023-12-20",
      "images": ["photo1.jpg", "photo2.jpg"],
      "documents": ["convite.pdf"],
      "videos": ["video1.mp4"],
      "group_id": null
    }
  ]
  ```
- **Códigos de Status**: 
  - 200 (Sucesso)
  - 500 (Erro no servidor)

#### Obter Evento por ID
- **Método HTTP**: GET
- **URL**: `/:id`
- **Descrição**: Retorna um evento específico pelo seu ID
- **Precisa de Autenticação**: Não
- **Parâmetros da URL**: 
  - `id`: ID do evento que deseja obter
- **Resposta**: Um único objeto de evento
- **Códigos de Status**: 
  - 200 (Sucesso)
  - 404 (Evento não encontrado)
  - 500 (Erro no servidor)

#### Criar Novo Evento
- **Método HTTP**: POST
- **URL**: `/`
- **Descrição**: Cria um novo evento com upload de arquivos
- **Precisa de Autenticação**: Sim (Bearer token)
- **Tipo de Conteúdo**: `multipart/form-data`
- **Campos do Formulário**:
  - `name` (string, obrigatório): Nome do evento
  - `description` (string, obrigatório): Descrição do evento
  - `date_event` (string, obrigatório): Data do evento (formato YYYY-MM-DD)
  - `principal_photo` (string): Nome do arquivo da foto principal
  - `group_id` (número, opcional): ID do grupo associado
  - `images` (array de arquivos, máx 20): Imagens do evento
  - `documents` (array de arquivos, máx 20): Documentos do evento
  - `videos` (array de arquivos, máx 5): Vídeos do evento
- **Resposta**: Objeto do evento criado com os caminhos dos arquivos
- **Códigos de Status**: 
  - 201 (Criado com sucesso)
  - 400 (Dados inválidos)
  - 401 (Não autenticado)
  - 500 (Erro no servidor)

#### Atualizar Evento
- **Método HTTP**: PUT
- **URL**: `/:id`
- **Descrição**: Atualiza um evento existente
- **Precisa de Autenticação**: Sim (Bearer token)
- **Tipo de Conteúdo**: `multipart/form-data`
- **Parâmetros da URL**: 
  - `id`: ID do evento a atualizar
- **Campos do Formulário**: Iguais ao endpoint de criação
- **Resposta**: Objeto do evento atualizado
- **Códigos de Status**: 
  - 200 (Sucesso)
  - 401 (Não autenticado)
  - 404 (Evento não encontrado)
  - 500 (Erro no servidor)

#### Deletar Evento
- **Método HTTP**: DELETE
- **URL**: `/:id`
- **Descrição**: Deleta um evento (na verdade marca como deletado, sem remover do banco)
- **Precisa de Autenticação**: Sim (Bearer token)
- **Parâmetros da URL**: 
  - `id`: ID do evento a deletar
- **Resposta**: Mensagem de sucesso
- **Códigos de Status**: 
  - 200 (Sucesso)
  - 401 (Não autenticado)
  - 404 (Evento não encontrado)
  - 500 (Erro no servidor)

---

### Grupos

#### Obter Todos os Grupos
- **Método HTTP**: GET
- **URL**: `/group`
- **Descrição**: Retorna uma lista de todos os grupos de eventos
- **Precisa de Autenticação**: Não
- **Resposta de Sucesso**:
  ```json
  [
    {
      "id": 1,
      "name": "Verão 2024",
      "description": "Coleção de eventos do verão",
      "events": [1, 2, 3],
      "date_creation": "2024-01-15"
    }
  ]
  ```
- **Códigos de Status**: 
  - 200 (Sucesso)
  - 500 (Erro no servidor)

#### Obter Grupo por ID
- **Método HTTP**: GET
- **URL**: `/group/:id`
- **Descrição**: Retorna um grupo específico com todos os eventos associados
- **Precisa de Autenticação**: Não
- **Parâmetros da URL**: 
  - `id`: ID do grupo
- **Resposta**: Objeto do grupo com detalhes completos dos eventos
- **Códigos de Status**: 
  - 200 (Sucesso)
  - 404 (Grupo não encontrado)
  - 500 (Erro no servidor)

#### Criar Novo Grupo
- **Método HTTP**: POST
- **URL**: `/group`
- **Descrição**: Cria um novo grupo de eventos
- **Precisa de Autenticação**: Sim (Bearer token)
- **Corpo da Requisição**:
  ```json
  {
    "name": "Verão 2024",
    "description": "Coleção de eventos do verão",
    "events": []
  }
  ```
- **Resposta**: Objeto do grupo criado
- **Códigos de Status**: 
  - 201 (Criado com sucesso)
  - 400 (Dados inválidos)
  - 401 (Não autenticado)
  - 500 (Erro no servidor)

#### Atualizar Grupo
- **Método HTTP**: PUT
- **URL**: `/group/:id`
- **Descrição**: Atualiza os detalhes de um grupo e os eventos associados
- **Precisa de Autenticação**: Sim (Bearer token)
- **Parâmetros da URL**: 
  - `id`: ID do grupo
- **Corpo da Requisição**:
  ```json
  {
    "name": "Nome Atualizado",
    "description": "Descrição atualizada",
    "events": [1, 2, 3, 4]
  }
  ```
- **Resposta**: Objeto do grupo atualizado
- **Códigos de Status**: 
  - 200 (Sucesso)
  - 401 (Não autenticado)
  - 404 (Grupo não encontrado)
  - 500 (Erro no servidor)

#### Deletar Grupo
- **Método HTTP**: DELETE
- **URL**: `/group/:id`
- **Descrição**: Deleta um grupo (marca como deletado, sem remover do banco)
- **Precisa de Autenticação**: Sim (Bearer token)
- **Parâmetros da URL**: 
  - `id`: ID do grupo a deletar
- **Resposta**: Mensagem de sucesso
- **Códigos de Status**: 
  - 200 (Sucesso)
  - 401 (Não autenticado)
  - 404 (Grupo não encontrado)
  - 500 (Erro no servidor)

---

## Autenticação

A API usa JWT (JSON Web Tokens) para proteger os endpoints que precisam de autenticação.

### Como Autenticar

O processo de autenticação tem dois passos simples:

1. Faça login para receber um token JWT:

```bash
curl -X POST http://localhost:3472/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "senha123"
  }'
```

2. Use o token recebido nas próximas requisições. Adicione ele no header `Authorization`:

```bash
curl -X GET http://localhost:3472/ \
  -H "Authorization: Bearer seu_token_aqui"
```

Substitua `seu_token_aqui` com o token que você recebeu no login.

### Entendendo o Token

O token JWT contém informações sobre o usuário codificadas. Se você decodificar um token, ele terá esse formato:

```javascript
{
  "id": 1,              // ID do usuário no banco
  "role": "admin",      // Papel do usuário (admin ou outro)
  "iat": 1703001234,   // Quando o token foi criado
  "exp": 1703087634    // Quando o token expira
}
```

### Middlewares Disponíveis

Existem dois middlewares de autenticação disponíveis:

- **authenticate**: Verifica se o token é válido e deixa a requisição passar
- **isAdmin**: Verifica se o usuário tem o papel de admin

O middleware `isAdmin` pode ser usado no futuro para proteger endpoints apenas para administradores.

### Exemplo Prático

Aqui está um exemplo completo de como fazer login e depois fazer uma requisição autenticada:

```bash
# 1. Faça login
TOKEN=$(curl -s -X POST http://localhost:3472/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"senha123"}' | jq -r '.token')

# 2. Use o token para fazer uma requisição
curl -X POST http://localhost:3472/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Novo Evento","description":"Descrição","date_event":"2024-12-25"}'
```

---

## Esquema do Banco de Dados

O banco de dados possui três tabelas principais que trabalham juntas para armazenar os dados da aplicação.

### Tabela de Usuários

A tabela `users` armazena as informações de login dos usuários:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- `id`: Número único que identifica cada usuário
- `username`: Nome de usuário para login (não pode repetir)
- `password`: Senha do usuário (armazenada com hash)
- `role`: Papel do usuário (admin é o padrão)
- `created_at`: Data e hora de quando o usuário foi criado

### Tabela de Eventos

A tabela `events` armazena todos os eventos criados:

```sql
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_req VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  principal_photo VARCHAR(255),
  images JSON,
  documents JSON,
  videos JSON,
  date_event DATE,
  date_creation DATE,
  date_deletion DATE DEFAULT NULL,
  group_id INT,
  FOREIGN KEY (group_id) REFERENCES event_groups(id)
);
```

- `id`: Número único do evento
- `id_req`: ID de requisição único para rastreamento
- `name`: Nome do evento
- `description`: Descrição detalhada
- `principal_photo`: Nome da foto principal
- `images`, `documents`, `videos`: Listas de arquivos em formato JSON
- `date_event`: Data em que o evento acontece
- `date_creation`: Data de quando o evento foi criado
- `date_deletion`: Data de deletamento (NULL se não foi deletado)
- `group_id`: ID do grupo ao qual este evento pertence

### Tabela de Grupos

A tabela `event_groups` organiza eventos em grupos:

```sql
CREATE TABLE event_groups (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  events JSON,
  date_creation DATE,
  date_deletion DATE DEFAULT NULL
);
```

- `id`: Número único do grupo
- `name`: Nome do grupo
- `description`: Descrição do grupo
- `events`: Array em JSON com os IDs dos eventos deste grupo
- `date_creation`: Data de criação
- `date_deletion`: Data de deletamento (NULL se não foi deletado)

### Características Importantes do Banco

1. **Soft Deletion**: Quando você deleta um evento ou grupo, não removemos do banco de dados. Apenas preenchemos o campo `date_deletion` com a data. Isso permite recuperar dados deletados se necessário.

2. **Armazenamento JSON**: Os arquivos (imagens, documentos, vídeos) são armazenados como listas JSON. Isso oferece flexibilidade sem criar tabelas extras.

3. **Transações**: Quando criamos ou atualizamos eventos e grupos, usamos transações de banco de dados. Isso garante que ou tudo salva com sucesso, ou nada salva (evita dados inconsistentes).

4. **Chaves Estrangeiras**: O campo `group_id` na tabela de eventos cria uma relação com a tabela de grupos, garantindo que cada evento possa estar associado a um grupo.

---

## Upload de Arquivos

O backend possui um sistema completo para receber e gerenciar arquivos enviados pelos usuários.

### Configuração do Upload

O upload é configurado através do middleware Multer, que define limites para cada tipo de arquivo:

- Imagens: Máximo de 20 arquivos por evento
- Documentos: Máximo de 20 arquivos por evento
- Vídeos: Máximo de 5 arquivos por evento

Estes limites estão configurados em `config/multer.js`.

### Como Funciona o Processo

1. O usuário envia arquivos através de um formulário multipart
2. O Multer recebe e processa os arquivos
3. Os arquivos são salvos nas pastas apropriadas em `/assets`
4. Os nomes dos arquivos são registrados no banco de dados como JSON
5. O usuário pode acessar os arquivos através das rotas estáticas

### Estrutura de Armazenamento

Os arquivos são organizados da seguinte forma:

```
assets/
├── images/              # Todas as imagens
│   ├── photo1.jpg
│   ├── photo2.png
│   └── ...
├── documents/           # Todos os documentos
│   ├── convite.pdf
│   ├── relatorio.docx
│   └── ...
└── videos/              # Todos os vídeos
    ├── video1.mp4
    ├── video2.avi
    └── ...
```

### Como Acessar os Arquivos

Depois que os arquivos estão salvos, você pode acessá-los diretamente através da URL do servidor:

```bash
# Acessar uma imagem
http://localhost:3472/assets/images/photo.jpg

# Acessar um documento
http://localhost:3472/assets/documents/convite.pdf

# Acessar um vídeo
http://localhost:3472/assets/videos/evento.mp4
```

Usando curl para baixar:

```bash
# Baixar uma imagem
curl -O http://localhost:3472/assets/images/photo.jpg

# Baixar um documento
curl -O http://localhost:3472/assets/documents/convite.pdf
```

### Exemplo de Upload Completo

Para criar um evento com arquivos, você precisará fazer uma requisição multipart:

```bash
curl -X POST http://localhost:3472/ \
  -H "Authorization: Bearer seu_token" \
  -F "name=Festa de Ano Novo" \
  -F "description=Grande festa de celebração" \
  -F "date_event=2024-12-31" \
  -F "principal_photo=capa.jpg" \
  -F "images=@foto1.jpg" \
  -F "images=@foto2.jpg" \
  -F "documents=@convite.pdf" \
  -F "videos=@video.mp4"
```

Este comando:
- Envia os dados do evento (nome, descrição, data)
- Envia 2 imagens (foto1.jpg e foto2.jpg)
- Envia 1 documento (convite.pdf)
- Envia 1 vídeo (video.mp4)

O servidor receberá tudo, salvará os arquivos e criará o evento com referências aos arquivos salvos.

---

## Deploy com Docker

Docker permite que você execute a aplicação em um container, garantindo que ela funcione da mesma forma em qualquer máquina.

### Construir a Imagem Docker

Primeiro, você precisa construir uma imagem Docker a partir do Dockerfile:

```bash
docker build -t event-gallery-backend .
```

Este comando:
- Lê as instruções do arquivo `Dockerfile`
- Cria uma imagem chamada `event-gallery-backend`
- Prepara tudo para executar em um container

### Executar o Container

Para iniciar o container com a aplicação:

```bash
docker run -p 3472:3472 \
  -e DB_HOST=localhost \
  -e DB_USER=root \
  -e DB_PASSWORD=sua_senha \
  -e DB_NAME=events_database \
  -e JWT_SECRET=sua_chave_secreta \
  -v event-gallery-assets:/app/assets \
  event-gallery-backend
```

Explicando as partes deste comando:

- `docker run`: Cria e inicia um novo container
- `-p 3472:3472`: Mapeia a porta 3472 do container para a porta 3472 do seu computador
- `-e`: Define variáveis de ambiente (DB_HOST, DB_USER, etc.)
- `-v`: Cria um volume para persistir os arquivos salvos
- `event-gallery-backend`: Nome da imagem a usar

### Usando Docker Compose

Docker Compose permite executar múltiplos containers (backend, banco de dados) com um único comando.

No diretório raiz do projeto (onde está o arquivo `docker-compose.yml`), execute:

```bash
docker-compose up -d backend
```

Isto irá:
- Iniciar o container do backend
- Configurar automaticamente as variáveis de ambiente
- Conectar ao banco de dados MySQL
- Manter os arquivos persistentes

Para parar os containers:

```bash
docker-compose down
```

### Arquivo Docker Compose

Se quiser entender o que o Docker Compose faz, aqui está o exemplo de configuração:

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "3472:3472"
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=sua_senha
      - DB_NAME=events_database
      - JWT_SECRET=sua_chave_secreta
    volumes:
      - ./backend/assets:/app/assets
    depends_on:
      - mysql
```

Esta configuração:
- Define a porta 3472 para acesso
- Define variáveis de ambiente
- Monta um volume para persistir assets
- Declara que depende do serviço `mysql`

### Entendendo o Dockerfile

O Dockerfile define como construir a imagem:

```dockerfile
FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /assets/images /assets/documents /assets/videos

EXPOSE 3472

CMD ["npm", "start"]
```

Explicação linha por linha:

- `FROM node:alpine`: Usa uma imagem base do Node.js leve
- `WORKDIR /app`: Define o diretório de trabalho como `/app`
- `COPY package*.json ./`: Copia os arquivos package.json para o container
- `RUN npm install`: Instala as dependências
- `COPY . .`: Copia o resto do código para o container
- `RUN mkdir -p ...`: Cria as pastas de assets
- `EXPOSE 3472`: Documenta que a porta 3472 será usada
- `CMD ["npm", "start"]`: Define o comando para iniciar a aplicação

### Verificar Logs do Container

Se algo deu errado, você pode ver os logs do container:

```bash
docker logs nome_do_container
```

Por exemplo:

```bash
docker logs event-gallery-backend
```

---

## Tratamento de Erros

A API retorna mensagens de erro padronizadas com códigos HTTP apropriados. Entender estes códigos ajuda a diagnosticar problemas.

### Códigos de Status HTTP

| Código | Significado | Quando Ocorre |
|--------|------------|---------------|
| 200 | OK - Sucesso | Requisição GET, PUT bem-sucedida |
| 201 | Criado - Sucesso | Requisição POST bem-sucedida |
| 400 | Requisição Inválida | Dados enviados incorretos ou incompletos |
| 401 | Não Autorizado | Token JWT ausente ou inválido |
| 403 | Acesso Proibido | Usuário sem permissão (ex: não é admin) |
| 404 | Não Encontrado | Evento, grupo ou usuário não existe |
| 500 | Erro no Servidor | Erro interno da aplicação ou banco de dados |

### Formato das Respostas de Erro

Todas as respostas de erro seguem este padrão:

```json
{
  "message": "Descrição do erro"
}
```

O campo `message` sempre contém uma descrição clara do que deu errado.

### Erros Comuns e Soluções

#### Token Ausente

Se você tentar fazer uma requisição autenticada sem enviar o token:

Resposta:
```json
{
  "message": "Não autorizado: token ausente"
}
```

Solução: Faça login primeiro para receber um token e envie-o no header `Authorization: Bearer seu_token`

#### Token Inválido

Se o token está expirado ou corrompido:

Resposta:
```json
{
  "message": "Token inválido"
}
```

Solução: Faça login novamente para receber um novo token válido

#### Credenciais Inválidas

Se username ou password estão errados no login:

Resposta:
```json
{
  "message": "Credenciais inválidas"
}
```

Solução: Verifique o username e password. Ambos devem estar corretos

#### Recurso Não Encontrado

Se você tenta acessar um evento ou grupo que não existe:

Resposta:
```json
{
  "message": "Evento não encontrado"
}
```

Solução: Verifique o ID que está usando. Pode ser que o ID esteja errado ou o recurso foi deletado

### Testando Endpoints com Erros

Aqui estão alguns exemplos de como testar diferentes cenários de erro:

```bash
# 1. Testar token ausente
curl -X POST http://localhost:3472/

# 2. Testar token inválido
curl -X POST http://localhost:3472/ \
  -H "Authorization: Bearer token_invalido"

# 3. Testar credenciais inválidas
curl -X POST http://localhost:3472/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"errado"}'

# 4. Testar evento não encontrado
curl -X GET http://localhost:3472/99999
```

---

## Contribuindo

Se você quer contribuir para o desenvolvimento deste projeto, siga os passos abaixo.

### Fluxo de Trabalho de Desenvolvimento

1. Crie uma branch para sua funcionalidade:
   ```bash
   git checkout -b feature/sua-funcionalidade
   ```

2. Faça suas mudanças no código

3. Teste tudo completamente para garantir que funciona

4. Faça commits com mensagens claras e descritivas:
   ```bash
   git commit -m "Adiciona nova funcionalidade de X"
   ```

5. Faça push da sua branch:
   ```bash
   git push origin feature/sua-funcionalidade
   ```

6. Abra um Pull Request descrevendo suas mudanças

### Padrões de Código

Ao contribuir, tente seguir estes padrões:

- Use sintaxe ES6+ (const, let, arrow functions, destructuring, etc.)
- Mantenha o estilo de código consistente com o resto do projeto
- Adicione tratamento de erros em todas as operações
- Use transações de banco de dados quando múltiplas operações precisam estar sincronizadas
- Sempre teste autenticação e autorização nos endpoints

### O Que Testar Antes de Fazer Push

Antes de enviar suas mudanças, certifique-se de testar:

1. Todas as operações CRUD de Eventos (Criar, Ler, Atualizar, Deletar)

```bash
# Criar evento
curl -X POST http://localhost:3472/ \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","description":"Teste","date_event":"2024-12-25"}'

# Ler eventos
curl -X GET http://localhost:3472/

# Atualizar evento
curl -X PUT http://localhost:3472/1 \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Atualizado"}'

# Deletar evento
curl -X DELETE http://localhost:3472/1 \
  -H "Authorization: Bearer seu_token"
```

2. Todas as operações CRUD de Grupos

```bash
# Criar grupo
curl -X POST http://localhost:3472/group \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Novo Grupo","description":"Teste","events":[]}'

# Ler grupos
curl -X GET http://localhost:3472/group

# Atualizar grupo
curl -X PUT http://localhost:3472/group/1 \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Atualizado","events":[1,2,3]}'

# Deletar grupo
curl -X DELETE http://localhost:3472/group/1 \
  -H "Authorization: Bearer seu_token"
```

3. Upload de arquivos com vários tipos

```bash
# Enviar com múltiplos arquivos
curl -X POST http://localhost:3472/ \
  -H "Authorization: Bearer seu_token" \
  -F "name=Teste" \
  -F "description=Teste" \
  -F "date_event=2024-12-25" \
  -F "images=@imagem1.jpg" \
  -F "images=@imagem2.jpg" \
  -F "documents=@arquivo.pdf"
```

4. Autenticação com credenciais válidas e inválidas

```bash
# Login válido
curl -X POST http://localhost:3472/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"correta"}'

# Login inválido
curl -X POST http://localhost:3472/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"errada"}'
```

5. Endpoints protegidos sem token

```bash
# Deve retornar erro 401
curl -X POST http://localhost:3472/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste"}'
```

6. Transações de banco de dados e rollbacks

Teste cenários onde a operação deveria falhar a meio do caminho. Verifique se o banco de dados volta ao estado anterior.

---

## Licença

ISC

---

## Suporte

Se você encontrar problemas, tiver dúvidas ou quiser sugerir melhorias, faça o seguinte:

1. Verifique este README para ver se a resposta já está aqui
2. Consulte a documentação das dependências (Express, MySQL2, JWT)
3. Abra uma issue no repositório com uma descrição clara do problema
4. Entre em contato com o time de desenvolvimento

---

## Recursos Adicionais

Aqui estão alguns recursos úteis para entender melhor as tecnologias utilizadas:

- Documentação do Express.js: https://expressjs.com/
- Documentação do MySQL2: https://github.com/sidorares/node-mysql2
- JWT e autenticação: https://tools.ietf.org/html/rfc7519
- Multer (Upload de Arquivos): https://github.com/expressjs/multer
- Docker: https://docs.docker.com/

### Tópicos Relacionados

Se quiser aprofundar mais, considere estudar:

- Autenticação e autorização com JWT
- Segurança em APIs REST
- Transações de banco de dados
- Tratamento de erros em Node.js
- Variáveis de ambiente e configuração
- Deploy e containerização com Docker

---

