# Event Gallery - Documentação Completa do Projeto

## Visão Geral

Event Gallery é uma aplicação web completa para gerenciamento de eventos e grupos de eventos. A aplicação permite criar, visualizar, editar e deletar eventos, organizá-los em grupos, e fazer upload de múltiplos tipos de mídia (imagens, documentos e vídeos).

O projeto é composto por três partes principais:

1. **Frontend**: Interface web interativa desenvolvida em React
2. **Backend**: API REST desenvolvida em Express.js
3. **Banco de Dados**: MySQL para armazenamento de dados

---

## Backend - Event Gallery API

### O que é o Backend?

O backend é um servidor API REST construído com Express.js que fornece todos os endpoints necessários para gerenciar eventos, grupos e autenticação de usuários.

### Tecnologias Principais

- **Express.js 4.18.2**: Framework web para criar a API
- **MySQL 8.0**: Banco de dados relacional
- **JWT (JSON Web Tokens)**: Autenticação segura
- **Multer 2.0.0**: Upload de arquivos
- **Node.js**: Runtime JavaScript

### Principais Funcionalidades

1. **Gerenciamento de Eventos**
   - Criar novos eventos com upload de múltiplas imagens, documentos e vídeos
   - Listar todos os eventos
   - Obter detalhes de um evento específico
   - Editar eventos existentes
   - Deletar eventos (soft delete - marca como deletado, não remove do banco)

2. **Gerenciamento de Grupos**
   - Criar grupos de eventos
   - Listar todos os grupos
   - Obter detalhes de um grupo com seus eventos
   - Editar grupos e seus eventos associados
   - Deletar grupos

3. **Autenticação e Segurança**
   - Login com username e password
   - Geração de tokens JWT
   - Proteção de endpoints com middleware de autenticação
   - Suporte a papéis de usuário (roles)

4. **Upload de Arquivos**
   - Máximo 20 imagens por evento
   - Máximo 20 documentos por evento
   - Máximo 5 vídeos por evento
   - Armazenamento em diretórios organizados

### Estrutura de Dados

**Evento:**
```
{
  id: número único,
  name: nome do evento,
  description: descrição,
  date_event: data do evento,
  images: array de nomes de arquivos de imagem,
  documents: array de nomes de arquivos de documento,
  videos: array de nomes de arquivos de vídeo,
  principal_photo: índice da imagem principal,
  group_id: ID do grupo (opcional)
}
```

**Grupo:**
```
{
  id: número único,
  name: nome do grupo,
  description: descrição,
  events: array de IDs de eventos
}
```

### Endpoints Principais

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/login` | Faz login do usuário | Não |
| GET | `/` | Lista todos os eventos | Não |
| POST | `/` | Cria novo evento | Sim |
| PUT | `/:id` | Edita evento | Sim |
| DELETE | `/:id` | Deleta evento | Sim |
| GET | `/group` | Lista todos os grupos | Não |
| POST | `/group` | Cria novo grupo | Sim |
| PUT | `/group/:id` | Edita grupo | Sim |
| DELETE | `/group/:id` | Deleta grupo | Sim |

### Segurança

- Usa JWT (JSON Web Tokens) para autenticação
- Tokens incluídos no header `Authorization: Bearer <token>`
- Endpoints protegidos verificam a validade do token
- Soft delete garante recuperação de dados

---

## Frontend - Event Gallery Web

### O que é o Frontend?

O frontend é uma interface web interativa desenvolvida em React que permite aos usuários gerenciar eventos e grupos através de uma experiência visual amigável.

### Tecnologias Principais

- **React 19.1.0**: Framework JavaScript para UI
- **React Router 7.6.1**: Roteamento de páginas
- **Tailwind CSS 4.1.7**: Estilização CSS utilitária
- **Radix UI**: Componentes sem estilo e acessíveis
- **Framer Motion 12.15.0**: Animações suaves
- **React Hook Form 7.56.3**: Gerenciamento de formulários
- **Zod 3.24.4**: Validação de dados
- **Vite 6.3.5**: Build tool rápido

### Principais Funcionalidades

1. **Autenticação**
   - Página de login com username e password
   - Armazenamento de token JWT em localStorage
   - Proteção de rotas que requerem autenticação
   - Logout automático ao tentar acessar rota sem token

2. **Visualização de Eventos**
   - Grid responsivo de eventos
   - Cards com imagem principal do evento
   - Modal com detalhes completos do evento
   - Visualização de imagens, documentos e vídeos
   - Busca de eventos por nome
   - Filtro de eventos por data

3. **Visualização de Grupos**
   - Grupos expandíveis/retráteis
   - Exibição de eventos dentro de grupos
   - Animações suaves ao expandir/recolher
   - Navegação entre visualização de eventos e grupos

4. **Gestão de Eventos**
   - Criar novo evento com upload de múltiplos arquivos
   - Editar evento existente
   - Deletar evento com confirmação
   - Seleção de imagem principal
   - Associação de evento a grupo
   - Preview de imagens antes de enviar

5. **Gestão de Grupos**
   - Criar novo grupo de eventos
   - Editar grupo existente
   - Deletar grupo com confirmação
   - Adicionar/remover eventos de um grupo

### Páginas Principais

| Rota | Tipo | Descrição |
|------|------|-----------|
| `/` | Pública | Página inicial com listagem de eventos/grupos |
| `/login` | Pública | Página de autenticação |
| `/add-event` | Protegida | Formulário para criar evento |
| `/add-group` | Protegida | Formulário para criar grupo |
| `/edit/:id` | Protegida | Formulário para editar evento |
| `/edit-group/:id` | Protegida | Formulário para editar grupo |

### Componentes Principais

- **EventCard**: Exibe evento em formato de card com imagem
- **GroupCard**: Exibe grupo com opção de expandir eventos
- **EventDetailModal**: Modal com detalhes completos do evento
- **AddEventForm**: Formulário para criar evento
- **AddGroupForm**: Formulário para criar grupo
- **EditEventForm**: Formulário para editar evento
- **EditGroupForm**: Formulário para editar grupo

### Fluxo de Autenticação

```
Usuário preenche credenciais
    ↓
Frontend envia POST para /login
    ↓
Backend retorna JWT token
    ↓
Token é armazenado em localStorage
    ↓
Frontend adiciona token em headers de requisições autenticadas
    ↓
Backend valida token em endpoints protegidos
```

---

## Docker Compose - Orquestração de Containers

### O que é Docker Compose?

Docker Compose é uma ferramenta que permite definir e executar múltiplos containers Docker como uma aplicação integrada. Ele usa um arquivo YAML (docker-compose.yml) para configurar todos os serviços da aplicação.

### Vantagens do Docker Compose

- Iniciar toda a aplicação com um único comando
- Isolamento completo entre containers
- Volumes para persistência de dados
- Networking automático entre containers
- Fácil escalabilidade
- Padronização do ambiente

### Arquivo docker-compose.yml - Análise Detalhada

O arquivo `docker-compose.yml` define três serviços: `frontend`, `backend` e `db`.

#### 1. Serviço Frontend

```yaml
frontend:
  depends_on:
    - backend
  
  build: ./frontend
  
  ports:
    - 3100:80
  
  networks:
    - app-net
```

**O que faz:**
- Define um container para o frontend da aplicação
- Constrói a imagem a partir de `./frontend/Dockerfile`
- Mapeia porta 80 do container para porta 3100 do host
- Conecta à rede `app-net`

**Detalhamento:**

- **depends_on: [backend]**
  - Docker Compose aguarda o backend iniciar antes de iniciar o frontend
  - Garante que o backend esteja disponível quando o frontend precisar
  - Permite que o frontend encontre o backend pelo nome de serviço

- **build: ./frontend**
  - Constrói a imagem Docker a partir do Dockerfile no diretório frontend
  - A imagem é criada localmente antes de executar o container

- **ports: ["3100:80"]**
  - Mapeia porta 80 do container para porta 3100 do seu computador
  - Você acessa o frontend em `http://localhost:3100`
  - Porta 80 é a porta padrão para HTTP dentro do container

- **networks: [app-net]**
  - Conecta o container à rede bridge `app-net`
  - Permite comunicação com backend usando nome `backend`
  - Frontend acessa backend em `http://backend:3472`

**Como é construído:**
O Dockerfile do frontend provavelmente:
1. Usa imagem Node ou um servidor web
2. Copia arquivos do projeto
3. Executa `npm run build` para criar build de produção
4. Serve os arquivos estáticos

---

#### 2. Serviço Backend

```yaml
backend:
  depends_on:
    - db
  
  build: ./backend
  
  ports:
    - 3472:3472
  
  environment:
    DB_HOST: ${DB_HOST}
    DB_USER: ${DB_USER}
    DB_PASSWORD: ${DB_PASSWORD}
    DB_NAME: ${DB_NAME}
    JWT_SECRET: ${JWT_SECRET}
  
  volumes:
    - ./backend:/app
    - assets_data:/assets
  
  networks:
    - app-net
```

**O que faz:**
- Define um container para a API backend
- Constrói a imagem a partir de `./backend/Dockerfile`
- Mapeia porta 3472 para comunicação com API
- Configura variáveis de ambiente para conexão com banco de dados
- Monta volumes para código e assets
- Conecta à rede app-net

**Detalhamento:**

- **depends_on: [db]**
  - Docker Compose aguarda o banco de dados iniciar antes do backend
  - Garante que MySQL esteja pronto para receber conexões

- **build: ./backend**
  - Constrói a imagem Docker a partir do Dockerfile no diretório backend
  - Imagem baseada em Node.js que executa Express.js

- **ports: ["3472:3472"]**
  - Mapeia porta 3472 do container para porta 3472 do host
  - API é acessível em `http://localhost:3472`
  - Frontend acessa em `http://backend:3472` dentro da rede Docker

- **environment**
  - Define variáveis de ambiente lidas do arquivo `.env`
  - `DB_HOST`: Nome do serviço MySQL (`db`)
  - `DB_USER`: Usuário MySQL
  - `DB_PASSWORD`: Senha do usuário MySQL
  - `DB_NAME`: Nome do banco de dados
  - `JWT_SECRET`: Chave secreta para assinar tokens JWT
  - Valores vêm do arquivo `.env` usando sintaxe `${VARIAVEL}`

- **volumes**
  - `./backend:/app`: Monta o código fonte local em `/app` do container
    - Permite desenvolvimento sem rebuild (hot reload em desenvolvimento)
    - Mudanças locais refletem no container em tempo real
  - `assets_data:/assets`: Volume nomeado para persistir uploads
    - Arquivos salvos neste volume persistem mesmo após container parar
    - Dados não são perdidos em re-deploy

- **networks: [app-net]**
  - Conecta à rede `app-net`
  - Pode ser acessado pelo nome `backend` pelos outros containers

---

#### 3. Serviço Database (MySQL)

```yaml
db:
  image: mysql:8.0
  
  environment:
    MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    MYSQL_DATABASE: ${MYSQL_DATABASE}
    MYSQL_USER: ${MYSQL_USER}
    MYSQL_PASSWORD: ${MYSQL_PASSWORD}
  
  volumes:
    - mysql_data:/var/lib/mysql
    - ./init_scripts:/docker-entrypoint-initdb.d
  
  networks:
    - app-net
```

**O que faz:**
- Define um container para MySQL 8.0
- Configura credenciais do banco de dados
- Monta volumes para persistência de dados e scripts de inicialização
- Conecta à rede app-net

**Detalhamento:**

- **image: mysql:8.0**
  - Usa imagem MySQL oficial versão 8.0
  - Não constrói imagem, usa pré-compilada do Docker Hub
  - Mais rápido do que fazer build próprio

- **environment**
  - `MYSQL_ROOT_PASSWORD`: Senha do usuário root MySQL
  - `MYSQL_DATABASE`: Nome do banco de dados a criar automaticamente
  - `MYSQL_USER`: Usuário MySQL customizado
  - `MYSQL_PASSWORD`: Senha do usuário customizado
  - Valores vêm do arquivo `.env`
  - Variáveis são lidas pela imagem MySQL ao inicializar

- **volumes**
  - `mysql_data:/var/lib/mysql`: Volume nomeado para dados MySQL
    - `/var/lib/mysql` é onde MySQL armazena arquivos de banco de dados
    - Dados persistem após container parar e ser reiniciado
    - Permite manter dados entre deployments
  - `./init_scripts:/docker-entrypoint-initdb.d`: Script de inicialização
    - Arquivos em `init_scripts/` são executados ao inicializar MySQL
    - Geralmente contém `schema.sql` para criar tabelas
    - Executa apenas na primeira inicialização

- **networks: [app-net]**
  - Conecta à rede `app-net`
  - Pode ser acessado pelo nome `db` pelos outros containers
  - Backend conecta em `db:3306` (porta padrão MySQL)

---

#### 4. Volumes

```yaml
volumes:
  assets_data:
    driver: local
  mysql_data:
    driver: local
```

**O que faz:**
- Define dois volumes nomeados que são compartilhados entre containers

**Detalhamento:**

- **assets_data**
  - Armazena arquivos enviados por usuários (imagens, documentos, vídeos)
  - Usa driver `local` (armazenamento no host)
  - Garantido que dados persistem entre reinicializações
  - Compartilhado entre frontend e backend se necessário

- **mysql_data**
  - Armazena banco de dados MySQL completo
  - Usa driver `local`
  - Dados persistem entre reinicializações
  - Backup pode ser feito do volume

**Diferença entre volumes e bind mounts:**
- `volumes: [mysql_data:/var/lib/mysql]`: Volume nomeado - gerenciado pelo Docker
- `volumes: [./backend:/app]`: Bind mount - diretório local mapeado para container

---

#### 5. Redes

```yaml
networks:
  app-net:
    driver: bridge
```

**O que faz:**
- Define uma rede Docker bridge chamada `app-net`
- Permite comunicação entre containers usando nomes

**Detalhamento:**

- **driver: bridge**
  - Tipo padrão de rede Docker
  - Cria um switch virtual que conecta containers
  - Cada container pode acessar outros pelo nome do serviço

- **Como funciona:**
  1. Frontend acessa Backend: `http://backend:3472`
  2. Backend acessa MySQL: `db:3306`
  3. Docker resolve nomes automaticamente

---

### Arquivo .env - Variáveis de Ambiente

O arquivo `.env` na raiz do projeto deve conter:

```env
# Banco de Dados
DB_HOST=db
DB_USER=event_user
DB_PASSWORD=sua_senha_segura
DB_NAME=events_database
MYSQL_ROOT_PASSWORD=sua_senha_root
MYSQL_DATABASE=events_database
MYSQL_USER=event_user
MYSQL_PASSWORD=sua_senha_segura

# JWT
JWT_SECRET=sua_chave_secreta_jwt
```

**Importante:**
- Não versione este arquivo no Git (adicione `.env` ao `.gitignore`)
- Use senhas seguras em produção
- `DB_HOST=db` aponta para o serviço MySQL pelo nome

---

### Fluxo de Inicialização

Quando você executa `docker-compose up`:

```
1. Docker verifica se as imagens existem
   └─ Se não existem, constrói do Dockerfile

2. Cria os volumes (assets_data, mysql_data)

3. Cria a rede app-net

4. Inicia container db (MySQL)
   └─ Executa scripts em ./init_scripts/
   └─ Cria banco de dados e tabelas

5. Inicia container backend
   └─ Aguarda db estar pronto
   └─ Conecta ao MySQL usando DB_HOST=db
   └─ Express.js fica listening na porta 3472

6. Inicia container frontend
   └─ Aguarda backend estar pronto
   └─ Constrói aplicação React
   └─ Inicia servidor web na porta 80
   └─ Mapeia para porta 3100

7. Aplicação está pronta em http://localhost:3100
```

---

### Comandos Úteis

**Iniciar os containers:**
```bash
docker-compose up
```

**Iniciar em background:**
```bash
docker-compose up -d
```

**Parar os containers:**
```bash
docker-compose down
```

**Ver logs:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

**Entrar em um container:**
```bash
docker-compose exec backend bash
docker-compose exec db mysql -u root -p
```

**Rebuild das imagens:**
```bash
docker-compose up --build
```

**Remover volumes (CUIDADO - deleta dados):**
```bash
docker-compose down -v
```

---

## Fluxo Completo da Aplicação

```
Usuário acessa http://localhost:3100
         ↓
Frontend (React) carrega no navegador
         ↓
Frontend tenta acessar http://backend:3472/
         ↓
Backend (Express) processa requisição
         ↓
Backend conecta ao db:3306
         ↓
MySQL retorna dados
         ↓
Backend retorna JSON ao Frontend
         ↓
Frontend renderiza dados na tela
```

---

## Deploy Local com Docker Compose

### Pré-requisitos

- Docker instalado
- Docker Compose instalado
- Arquivo `.env` configurado

### Passos

1. **Clonar o repositório:**
   ```bash
   git clone <repo-url>
   cd event-gallery
   ```

2. **Criar arquivo .env:**
   ```bash
   cp .env.example .env
   # Editar .env com senhas seguras
   ```

3. **Iniciar aplicação:**
   ```bash
   docker-compose up -d
   ```

4. **Verificar status:**
   ```bash
   docker-compose ps
   ```

5. **Acessar aplicação:**
   - Frontend: http://localhost:3100
   - API: http://localhost:3472
   - MySQL: localhost:3306

6. **Ver logs se houver problemas:**
   ```bash
   docker-compose logs -f
   ```

---

## Troubleshooting

### Problema: "Connection refused" ao acessar API

**Causa:** Backend ainda está iniciando

**Solução:**
```bash
docker-compose logs -f backend
# Aguarde "Servidor rodando na porta 3472"
```

### Problema: "Cannot connect to database"

**Causa:** MySQL ainda está iniciando ou credenciais erradas

**Solução:**
1. Verifique arquivo `.env`
2. Verifique logs: `docker-compose logs -f db`
3. Aguarde MySQL inicializar completamente

### Problema: Porta 3100 já em uso

**Causa:** Outra aplicação usando porta 3100

**Solução:** Altere em docker-compose.yml:
```yaml
ports:
  - 3101:80  # Use 3101 em vez de 3100
```

### Problema: Volumes não persistem

**Causa:** Volumes precisam ser explicitamente mantidos

**Solução:** Não use `docker-compose down -v`
```bash
docker-compose down  # Sem -v
```

---

## Segurança em Produção

Para usar em produção:

1. **Alterar .env:**
   - Use senhas fortes
   - Altere JWT_SECRET
   - Altere credenciais padrão

2. **Nginx/Proxy reverso:**
   - Adicione HTTPS
   - Configure rate limiting
   - Validação de CORS

3. **Backup de dados:**
   ```bash
   docker-compose exec db mysqldump -u root -p events_database > backup.sql
   ```

4. **Monitoramento:**
   - Configure logs centralizados
   - Monitore uso de recursos
   - Alertas para erros

---