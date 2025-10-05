# Backend de Eventos

Backend desenvolvido com Express.js para gerenciamento de eventos com upload de imagens.

## Tecnologias Utilizadas

- **Express.js**: Framework web para Node.js
- **MySQL2**: Driver para conexão com banco de dados MySQL
- **Multer**: Middleware para upload de arquivos
- **CORS**: Middleware para habilitar CORS

## Estrutura do Projeto

```
backend-eventos/
├── assets/
│   └── uploads/          # Pasta onde as imagens são armazenadas
├── database.js           # Configuração do banco de dados
├── index.js              # Arquivo principal do servidor
├── package.json          # Dependências do projeto
└── README.md             # Este arquivo
```

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure o banco de dados MySQL:
   - Crie um banco de dados chamado `eventos_db`
   - Atualize as credenciais em `database.js` se necessário

3. Inicie o servidor:
```bash
npm start
```

Ou em modo de desenvolvimento (com auto-reload):
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3472`

## Rotas da API

### CREATE - Criar Evento

**Endpoint:** `POST /`

**Content-Type:** `multipart/form-data`

**Campos:**
- `name` (string, obrigatório): Nome do evento
- `description` (string, opcional): Descrição do evento
- `principal_photo` (number, obrigatório): Índice da foto principal (0 para primeira imagem)
- `date_event` (date, obrigatório): Data do evento no formato YYYY-MM-DD
- `images` (files, obrigatório): Array de arquivos de imagem (máximo 10)

**Exemplo com cURL:**
```bash
curl -X POST http://localhost:3472/ \
  -F "name=Festival de Música 2024" \
  -F "description=Festival ao ar livre com artistas nacionais" \
  -F "principal_photo=0" \
  -F "date_event=2024-12-15" \
  -F "images=@/caminho/para/imagem1.jpg" \
  -F "images=@/caminho/para/imagem2.jpg"
```

**Resposta (201):**
```json
{
  "id": 1,
  "id_req": "REQ-1696350000000",
  "name": "Festival de Música 2024",
  "images": [
    "./assets/uploads/evento-1696350000000-123456789.jpg",
    "./assets/uploads/evento-1696350000000-987654321.jpg"
  ],
  "description": "Festival ao ar livre com artistas nacionais",
  "principal_photo": 0,
  "date_creation": "3-10-2024",
  "date_event": "2024-12-15"
}
```

### READ - Listar Todos os Eventos

**Endpoint:** `GET /`

**Exemplo:**
```bash
curl http://localhost:3472/
```

**Resposta (200):**
```json
[
  {
    "id": 1,
    "id_req": "REQ-1696350000000",
    "name": "Festival de Música 2024",
    "images": [
      "./assets/uploads/evento-1696350000000-123456789.jpg"
    ],
    "description": "Festival ao ar livre",
    "principal_photo": 0,
    "date_creation": "3-10-2024",
    "date_event": "2024-12-15",
    "date_deletion": null
  }
]
```

### READ - Buscar Evento por ID

**Endpoint:** `GET /:id`

**Exemplo:**
```bash
curl http://localhost:3472/1
```

**Resposta (200):**
```json
{
  "id": 1,
  "id_req": "REQ-1696350000000",
  "name": "Festival de Música 2024",
  "images": [
    "./assets/uploads/evento-1696350000000-123456789.jpg"
  ],
  "description": "Festival ao ar livre",
  "principal_photo": 0,
  "date_creation": "3-10-2024",
  "date_event": "2024-12-15",
  "date_deletion": null
}
```

### UPDATE - Atualizar Evento

**Endpoint:** `PUT /:id`

**Content-Type:** `multipart/form-data`

**Campos (todos opcionais):**
- `name` (string): Novo nome do evento
- `description` (string): Nova descrição
- `principal_photo` (number): Novo índice da foto principal
- `images` (files): Novas imagens (substituem as antigas)

**Exemplo:**
```bash
curl -X PUT http://localhost:3472/1 \
  -F "name=Festival de Música 2025" \
  -F "description=Nova descrição do evento"
```

**Resposta (200):**
```json
{
  "id": "1",
  "name": "Festival de Música 2025",
  "images": [
    "./assets/uploads/evento-1696350000000-123456789.jpg"
  ],
  "description": "Nova descrição do evento",
  "principal_photo": 0
}
```

### DELETE - Deletar Evento

**Endpoint:** `DELETE /:id`

**Exemplo:**
```bash
curl -X DELETE http://localhost:3472/1
```

**Resposta (200):**
```json
{
  "message": "Evento deletado com sucesso",
  "id": "1",
  "date_deletion": "3-10-2024"
}
```

## Estrutura do Banco de Dados

### Tabela: eventos

| Campo            | Tipo         | Descrição                                    |
|------------------|--------------|----------------------------------------------|
| id               | INT          | ID auto-incrementado (chave primária)        |
| id_req           | VARCHAR(255) | ID da requisição                             |
| name             | VARCHAR(255) | Nome do evento                               |
| images           | TEXT         | JSON array com caminhos das imagens          |
| description      | TEXT         | Descrição do evento                          |
| principal_photo  | INT          | Índice da foto principal                     |
| date_creation    | VARCHAR(50)  | Data de criação do registro                  |
| date_event       | DATE         | Data do evento                               |
| date_deletion    | VARCHAR(50)  | Data de exclusão (soft delete)               |

## Armazenamento de Imagens

As imagens são armazenadas na pasta `assets/uploads/` com o seguinte padrão de nomenclatura:

```
evento-{timestamp}-{random}.{extensão}
```

Exemplo: `evento-1696350000000-123456789.jpg`

Os caminhos são salvos no banco de dados no formato:
```
./assets/uploads/evento-1696350000000-123456789.jpg
```

## Validações

- **Nome do evento**: Não pode conter caracteres especiais
- **Imagens**: Apenas formatos jpeg, jpg, png, gif, webp
- **Tamanho máximo**: 10MB por imagem
- **Quantidade máxima**: 10 imagens por evento
- **Data do evento**: Deve ser uma data válida

## Observações

- O backend utiliza **soft delete**, ou seja, os eventos não são removidos fisicamente do banco, apenas marcados com `date_deletion`
- As imagens antigas são deletadas do sistema de arquivos quando um evento é atualizado com novas imagens
- A pasta `assets/uploads` é criada automaticamente ao iniciar o servidor
- Os arquivos estáticos da pasta `assets` são servidos através da rota `/assets`
