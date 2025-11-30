# Event Gallery - Frontend

Frontend de gerenciamento de eventos construído com React, desenvolvido para trabalhar com a API backend do Event Gallery.

## Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando a Aplicação](#executando-a-aplicação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Componentes](#componentes)
- [Páginas](#páginas)
- [Serviços](#serviços)
- [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Rotas da Aplicação](#rotas-da-aplicação)
- [Como Funciona](#como-funciona)
- [Deploy com Docker](#deploy-com-docker)
- [Contribuindo](#contribuindo)

## Tecnologias Utilizadas

Este projeto utiliza as seguintes tecnologias principais:

### Framework e Biblioteca de UI

- **React 19.1.0**: Framework JavaScript para construção de interfaces de usuário interativas
- **React Router DOM 7.6.1**: Roteamento de páginas e navegação entre diferentes views
- **Tailwind CSS 4.1.7**: Framework CSS para estilização e design responsivo

### Validação e Formulários

- **React Hook Form 7.56.3**: Gerenciamento eficiente de formulários com pouco re-render
- **Zod 3.24.4**: Validação de dados em tempo de execução
- **@hookform/resolvers 5.0.1**: Integração entre React Hook Form e validadores como Zod

### Componentes UI

- **Radix UI**: Conjunto de componentes sem estilo e acessíveis
  - React Accordion
  - React Alert Dialog
  - React Avatar
  - React Checkbox
  - React Collapsible
  - React Dialog
  - React Dropdown Menu
  - React Label
  - React Menubar
  - React Navigation Menu
  - React Popover
  - React Progress
  - React Radio Group
  - React Scroll Area
  - React Select
  - React Slider
  - React Switch
  - React Tabs
  - React Toggle
  - React Tooltip

- **Lucide React 0.510.0**: Ícones SVG leves e customizáveis (usados em botões e indicadores visuais)

### Animações e Transições

- **Framer Motion 12.15.0**: Biblioteca de animações para React, usada para transições suaves entre elementos
- **Embla Carousel React 8.6.0**: Carousel/carrossel responsivo para exibição de imagens

### Utilitários de Estilo e Classe

- **Tailwind Merge 3.3.0**: Merge inteligente de classes Tailwind CSS
- **CLSX 2.1.1**: Ferramenta para concatenar classes CSS condicionalmente
- **Class Variance Authority 0.7.1**: Variações de componentes em CSS

### Funcionalidades Adicionais

- **Date-fns 4.1.0**: Manipulação e formatação de datas
- **React Day Picker 8.10.1**: Seletor de datas tipo calendário
- **Next Themes 0.4.6**: Gerenciamento de temas (modo claro/escuro)
- **Sonner 2.0.3**: Toast notifications para feedback do usuário
- **Cmdk 1.1.1**: Componente de comando/busca (type-ahead)
- **Input OTP 1.4.2**: Entrada para códigos OTP
- **React Resizable Panels 3.0.2**: Painéis redimensionáveis
- **Vaul 1.1.2**: Drawer/gaveta animada
- **Recharts 2.15.3**: Biblioteca de gráficos

### Ferramentas de Build e Desenvolvimento

- **Vite 6.3.5**: Bundler rápido e moderno para desenvolvimento
- **@vitejs/plugin-react 4.4.1**: Plugin do Vite para suporte a React com Fast Refresh
- **@tailwindcss/vite 4.1.7**: Plugin do Vite para Tailwind CSS
- **Tailwind CSS 4.1.7**: Framework CSS utilitário

### Ferramentas de Qualidade de Código

- **ESLint 9.25.0**: Linter para identificar e corrigir problemas no código
- **@eslint/js 9.25.0**: Configuração recomendada do ESLint
- **eslint-plugin-react-hooks 5.2.0**: Validação de regras de hooks do React
- **eslint-plugin-react-refresh 0.4.19**: Validação de Fast Refresh

---

## Pré-requisitos

Antes de começar, certifique-se de que você tem instalado:

- Node.js (versão 16 ou superior)
- npm ou pnpm como gerenciador de pacotes
- Backend Event Gallery rodando na porta 3472

## Instalação

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd frontend
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

### 3. Verificar Instalação

Para confirmar que tudo foi instalado corretamente, você pode executar o comando de linting:

```bash
npm run lint
```

Se não houver erros, a instalação foi bem-sucedida.

---

## Configuração

### 1. Variáveis de Ambiente

O frontend se conecta automaticamente ao backend em `http://localhost:3472`. Se você quiser alterar isso, procure por `API_URL` nos arquivos:

- `src/services/api.js`: URL base da API
- `src/components/cards/EventCard.jsx`: URL base para imagens
- `src/pages/Login.jsx`: URL do endpoint de login

### 2. Arquivo de Configuração do Vite

O arquivo `vite.config.js` já está pré-configurado com:
- Alias `@` que aponta para `./src`
- Hot Module Replacement (HMR) habilitado
- Monitoramento de arquivos para desenvolvimento

Você normalmente não precisa alterar este arquivo.

---

## Executando a Aplicação

### Modo Desenvolvimento

Para iniciar o servidor de desenvolvimento com Hot Reload (recarregamento automático):

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou na porta indicada no terminal).

O modo desenvolvimento oferece:
- Recarregamento automático quando você salva arquivos
- Mensagens de erro detalhadas no navegador
- DevTools do React disponíveis

### Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Isso cria uma pasta `dist/` com os arquivos minificados.

### Preview de Produção

Para visualizar como a build de produção se comportará:

```bash
npm run preview
```

### Linting e Correção de Código

Para verificar problemas no código:

```bash
npm run lint
```

---

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── pages/                      # Páginas principais da aplicação
│   │   ├── Home.jsx               # Página inicial com listagem de eventos/grupos
│   │   ├── Login.jsx              # Página de autenticação
│   │   ├── AddEvent.jsx           # Página para criar novo evento
│   │   ├── AddGroup.jsx           # Página para criar novo grupo
│   │   ├── EditEvent.jsx          # Página para editar evento
│   │   └── EditGroup.jsx          # Página para editar grupo
│   │
│   ├── components/                 # Componentes reutilizáveis
│   │   ├── cards/                 # Componentes de cards
│   │   │   ├── EventCard.jsx      # Card exibindo evento
│   │   │   └── GroupCard.jsx      # Card exibindo grupo
│   │   │
│   │   ├── forms/                 # Formulários
│   │   │   ├── AddEventForm.jsx   # Formulário para criar evento
│   │   │   ├── AddGroupForm.jsx   # Formulário para criar grupo
│   │   │   ├── EditEventForm.jsx  # Formulário para editar evento
│   │   │   └── EditGroupForm.jsx  # Formulário para editar grupo
│   │   │
│   │   ├── modals/                # Modais/janelas popup
│   │   │   ├── EventDetailModal.jsx  # Modal com detalhes completos do evento
│   │   │   └── ConfirmModal.jsx      # Modal de confirmação para ações
│   │   │
│   │   └── ui/                    # Componentes de UI do Radix (biblioteca)
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── dialog.jsx
│   │       ├── form.jsx
│   │       └── ... (vários outros)
│   │
│   ├── services/                   # Serviços de API
│   │   └── api.js                 # Funções para requisições HTTP
│   │
│   ├── hooks/                      # Custom hooks do React
│   │   └── use-mobile.js          # Hook para detectar se está em dispositivo móvel
│   │
│   ├── lib/                        # Utilitários e funções auxiliares
│   │   └── utils.js               # Funções utilitárias (como cn para classes CSS)
│   │
│   ├── assets/                     # Recursos estáticos
│   ├── App.jsx                     # Componente raiz com rotas
│   ├── App.css                     # Estilos globais da aplicação
│   ├── main.jsx                    # Ponto de entrada do React
│   ├── index.css                   # Estilos globais do projeto
│   └── main.css                    # Estilos adicionais
│
├── public/                         # Arquivos estáticos públicos
├── index.html                      # HTML principal
├── vite.config.js                  # Configuração do Vite
├── tailwind.config.js              # Configuração do Tailwind CSS
├── jsconfig.json                   # Configuração de JavaScript
├── eslint.config.js                # Configuração do ESLint
├── components.json                 # Configuração de componentes
├── package.json                    # Dependências e scripts
└── Dockerfile                      # Configuração para Docker
```

---

## Componentes

### EventCard.jsx

Componente que exibe um evento em formato de card com imagem.

**Funcionalidades:**
- Exibe imagem principal do evento
- Formatação automática de data
- Detecção de proporção de imagem (vertical/horizontal/square)
- Efeito hover com zoom na imagem
- Clique para abrir modal com detalhes

**Props:**
- `event`: Objeto do evento com dados
- `onClick`: Função chamada quando card é clicado

**Exemplo de Uso:**
```jsx
<EventCard 
  event={eventData} 
  onClick={handleCardClick}
/>
```

---

### GroupCard.jsx

Componente que exibe um grupo de eventos.

**Funcionalidades:**
- Exibe grupo com opção de expandir/recolher
- Mostra primeiro evento do grupo ou lista expandida
- Botões para editar e excluir (quando autenticado)
- Animação suave ao expandir/recolher
- Modal de confirmação antes de deletar

**Props:**
- `group`: Objeto do grupo com dados
- `onCardClick`: Função chamada ao clicar em evento dentro do grupo
- `onGroupDeleted`: Função chamada quando grupo é deletado
- `isAuth`: Boolean indicando se usuário está autenticado

**Exemplo de Uso:**
```jsx
<GroupCard 
  group={groupData}
  onCardClick={handleEventClick}
  onGroupDeleted={handleGroupDeletion}
  isAuth={isAuthenticated}
/>
```

---

### EventDetailModal.jsx

Modal que exibe detalhes completos de um evento.

**Funcionalidades:**
- Carrossel de imagens e vídeos
- Visualização de documentos
- Informações completo do evento (nome, descrição, data)
- Botões para editar e deletar (quando autenticado)
- Suporte a vídeos, imagens e documentos
- Botão para copiar link do evento
- Indicador de carregamento

**Props:**
- `event`: Objeto do evento
- `isOpen`: Boolean se modal está aberto
- `onClose`: Função para fechar modal
- `onEventDeleted`: Função chamada ao deletar evento
- `modalError`: String de erro para exibir

**Exemplo de Uso:**
```jsx
<EventDetailModal
  event={selectedEvent}
  isOpen={modalOpen}
  onClose={handleCloseModal}
  onEventDeleted={handleEventDeletion}
/>
```

---

### ConfirmModal.jsx

Modal simples de confirmação para ações que podem ser perigosas.

**Funcionalidades:**
- Pergunta de confirmação
- Botão para cancelar
- Botão para confirmar
- Fundo escuro semi-transparente

**Props:**
- `isOpen`: Boolean se modal está aberto
- `onClose`: Função para fechar modal
- `onConfirm`: Função para executar ação confirmada

**Exemplo de Uso:**
```jsx
<ConfirmModal
  isOpen={confirmOpen}
  onClose={handleCloseConfirm}
  onConfirm={handleDeleteConfirm}
/>
```

---

### AddEventForm.jsx

Formulário para criar um novo evento com upload de múltiplos arquivos.

**Funcionalidades:**
- Campo para nome do evento
- Seleção de data do evento
- Campo de descrição
- Upload múltiplo de imagens
- Upload múltiplo de documentos
- Upload múltiplo de vídeos
- Seleção de imagem principal
- Preview das imagens antes de enviar
- Validação de campos obrigatórios
- Seleção opcional de grupo

**Props:**
- `onSubmit`: Função chamada quando formulário é enviado
- `onCancel`: Função para cancelar/voltar

**Campos do Formulário:**
- `name`: string (obrigatório)
- `date_event`: date (obrigatório)
- `description`: string (opcional)
- `principal_photo`: number (índice da imagem principal)
- `group_id`: number (opcional)
- `images`: file[] (obrigatório, min 1)
- `documents`: file[] (opcional)
- `videos`: file[] (opcional)

---

### AddGroupForm.jsx

Formulário para criar um novo grupo de eventos.

**Funcionalidades:**
- Campo para nome do grupo
- Campo para descrição
- Seleção múltipla de eventos
- Validação de nome obrigatório
- Carregamento automático de eventos

**Props:**
- `onCancel`: Função para cancelar

**Campos do Formulário:**
- `name`: string (obrigatório)
- `description`: string (opcional)
- `events`: number[] (array de IDs de eventos)

---

### EditEventForm.jsx

Formulário para editar um evento existente.

**Funcionalidades:**
- Similar ao AddEventForm
- Carrega dados do evento existente
- Permite remover imagens existentes
- Permite adicionar novas imagens
- Mantém referência a arquivos existentes
- Valida antes de enviar

**Props:**
- `onSubmit`: Função chamada quando formulário é enviado
- `onCancel`: Função para cancelar

---

### EditGroupForm.jsx

Formulário para editar um grupo existente.

**Funcionalidades:**
- Similar ao AddGroupForm
- Carrega dados do grupo existente
- Permite adicionar/remover eventos
- Valida antes de enviar

**Props:**
- `groupId`: ID do grupo a editar
- `onCancel`: Função para cancelar

---

## Páginas

### Home.jsx

Página inicial da aplicação. Exibe eventos e grupos de eventos.

**Funcionalidades:**
- Listagem de eventos em grid responsivo
- Listagem de grupos expandíveis
- Toggle para alternar entre visualização de eventos e grupos
- Busca de eventos por nome
- Filtro de eventos por data
- Carregamento automático de dados
- Modal de detalhes ao clicar em evento
- Botões de ação quando autenticado

**Estados:**
- `events`: Array de eventos
- `groups`: Array de grupos
- `isAuth`: Se usuário está autenticado
- `viewMode`: "events" ou "groups"
- `searchTerm`: Termo de busca
- `filterDate`: Data para filtro

**Fluxo:**
1. Componente monta, verifica autenticação
2. Carrega grupos
3. Carrega eventos quando aba de eventos é ativada
4. Exibe eventos ou grupos conforme viewMode
5. Ao clicar em evento, abre modal com detalhes

---

### Login.jsx

Página de autenticação do usuário.

**Funcionalidades:**
- Campo para usuário
- Campo para senha
- Botão de login
- Indicador de carregamento durante envio
- Exibição de erros de autenticação
- Redireciona para home ao fazer login bem-sucedido
- Armazena token JWT no localStorage

**Estados:**
- `username`: Nome de usuário inserido
- `password`: Senha inserida
- `loading`: Se está processando login
- `error`: Mensagem de erro

**Fluxo:**
1. Usuário preenche credenciais
2. Ao clicar em login, envia requisição POST para backend
3. Se sucesso, salva token e redireciona
4. Se erro, exibe mensagem de erro

---

### AddEvent.jsx

Página para adicionar novo evento. Wrapper da página que utiliza AddEventForm.

**Funcionalidades:**
- Header com título e ícone
- Botão para voltar
- Animação ao carregar
- Chama onSubmit com dados do formulário

**Fluxo:**
1. Usuário clica em "Adicionar Evento"
2. Formulário é exibido
3. Usuário preenche dados
4. Ao submeter, envia para API
5. Se sucesso, volta para home

---

### AddGroup.jsx

Página para adicionar novo grupo. Wrapper da página que utiliza AddGroupForm.

**Funcionalidades:**
- Header com título e ícone
- Botão para voltar
- Animação ao carregar
- Chama onSubmit com dados do formulário

**Fluxo:**
1. Usuário clica em "Adicionar Grupo"
2. Formulário é exibido
3. Usuário preenche dados e seleciona eventos
4. Ao submeter, envia para API
5. Se sucesso, volta para home

---

### EditEvent.jsx

Página para editar evento existente. Wrapper da página que utiliza EditEventForm.

**Funcionalidades:**
- Header com título e ícone
- Botão para voltar
- Animação ao carregar
- Carrega dados do evento pelo ID da rota

**Fluxo:**
1. Usuário clica em "Editar" em um evento
2. Formulário carrega dados do evento
3. Usuário modifica dados
4. Ao submeter, envia para API
5. Se sucesso, volta para home

---

### EditGroup.jsx

Página para editar grupo existente. Wrapper da página que utiliza EditGroupForm.

**Funcionalidades:**
- Header com título e ícone
- Botão para voltar
- Animação ao carregar
- Carrega dados do grupo pelo ID da rota

**Fluxo:**
1. Usuário clica em "Editar" em um grupo
2. Formulário carrega dados do grupo
3. Usuário modifica dados e eventos
4. Ao submeter, envia para API
5. Se sucesso, volta para home

---

## Serviços

### api.js

Arquivo central para todas as chamadas à API. Organiza as requisições por tipo de recurso.

**Objeto `eventAPI`:**

```javascript
eventAPI.createEvent(formData)         // POST /
eventAPI.getAllEvents()                // GET /
eventAPI.getEventById(id)              // GET /:id
eventAPI.updateEvent(id, updateData)   // PUT /:id
eventAPI.deleteEvent(id)               // DELETE /:id
```

**Objeto `groupAPI`:**

```javascript
groupAPI.getAllGroups()                // GET /group
groupAPI.getGroupById(id)              // GET /group/:id
groupAPI.createGroup(data)             // POST /group
groupAPI.updateGroup(id, data)         // PUT /group/:id
groupAPI.deleteGroup(id)               // DELETE /group/:id
```

**Características:**
- Recupera token JWT do localStorage automaticamente
- Adiciona token ao header Authorization
- Realiza tratamento básico de erros
- Retorna dados parseados do JSON

**Exemplo de Uso:**
```javascript
import { eventAPI, groupAPI } from '../services/api.js';

// Buscar todos os eventos
const eventos = await eventAPI.getAllEvents();

// Criar novo evento
const novoEvento = await eventAPI.createEvent(formData);

// Deletar evento
await eventAPI.deleteEvent(eventId);
```

---

## Fluxo de Autenticação

O sistema de autenticação funciona da seguinte forma:

### 1. Login

```
Usuário -> Login.jsx -> API (/login) -> Token retornado -> localStorage
```

**Processo:**
1. Usuário acessa página de login
2. Preenche username e password
3. Frontend envia POST para `http://localhost:3472/login`
4. Backend retorna token JWT
5. Token é salvo em `localStorage.getItem("token")`

### 2. Requisições Autenticadas

```
Componente -> api.js -> Recupera token -> Adiciona ao header -> API
```

**Processo:**
1. Componente precisa fazer requisição autenticada
2. Chama função em api.js (ex: eventAPI.createEvent)
3. api.js recupera token do localStorage
4. Adiciona token ao header: `Authorization: Bearer <token>`
5. Envia requisição para backend

### 3. Proteção de Rotas

```
Acesso à rota -> App.jsx verifica token -> PrivateRoute -> Renderiza ou redireciona
```

**Processo:**
1. Usuário tenta acessar rota protegida (ex: /add-event)
2. Componente PrivateRoute verifica se token existe
3. Se existe, renderiza componente
4. Se não existe, redireciona para /login

### 4. Logout

```
Usuário clica logout -> Remove token do localStorage -> Redireciona para login
```

**Processo:**
1. Usuário clica em logout (não explícito neste código, mas pode ser adicionado)
2. Remove token do localStorage: `localStorage.removeItem("token")`
3. Interface detecta mudança e redireciona para login

### Detecção de Mudanças de Autenticação

O código usa o evento `storage` do navegador para detectar mudanças no localStorage:

```javascript
useEffect(() => {
  const handleStorageChange = () => setIsAuth(!!localStorage.getItem('token'));
  handleStorageChange();
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

Isso permite que múltiplas abas do navegador sincronizem o estado de autenticação.

---

## Rotas da Aplicação

A aplicação possui as seguintes rotas definidas em `App.jsx`:

| Rota | Tipo | Componente | Descrição |
|------|------|-----------|-----------|
| `/` | Pública | Home | Página inicial com listagem de eventos/grupos |
| `/login` | Pública | Login | Página de autenticação |
| `/add-event` | Protegida | AddEvent | Formulário para criar evento |
| `/add-group` | Protegida | AddGroup | Formulário para criar grupo |
| `/edit/:id` | Protegida | EditEvent | Formulário para editar evento |
| `/edit-group/:id` | Protegida | EditGroup | Formulário para editar grupo |
| `/evento/:id` | Pública | Home | Abre modal do evento específico |
| `*` | Pública | Home | Rota curinga (redireciona para home) |

**Rotas Protegidas:**
Rotas protegidas só podem ser acessadas se o usuário tiver um token JWT válido armazenado no localStorage. Caso contrário, o usuário é redirecionado para `/login`.

---

## Como Funciona

### Ciclo de Vida de Um Evento

#### 1. Criar Evento

```
AddEvent.jsx -> AddEventForm.jsx
   |
   | (usuário preenche form)
   v
handleSubmit() -> eventAPI.createEvent(formData)
   |
   | (envia POST com FormData)
   v
Backend processa e retorna evento criado
   |
   v
navigate('/') -> Volta para Home
```

#### 2. Visualizar Evento

```
Home.jsx carrega eventos
   |
   v
EventCard.jsx renderiza cada evento
   |
   v
Usuário clica no card
   |
   v
EventDetailModal.jsx abre e exibe detalhes
```

#### 3. Editar Evento

```
Home.jsx -> EventDetailModal.jsx
   |
   | (usuário clica "editar")
   v
navigate('/edit/:id')
   |
   v
EditEvent.jsx -> EditEventForm.jsx
   |
   | (EditEventForm carrega dados do evento)
   v
handleSubmit() -> eventAPI.updateEvent(id, formData)
   |
   v
Backend processa e retorna evento atualizado
   |
   v
navigate('/') -> Volta para Home
```

#### 4. Deletar Evento

```
EventDetailModal.jsx
   |
   | (usuário clica "deletar")
   v
ConfirmModal aparece
   |
   v
Usuário confirma
   |
   v
eventAPI.deleteEvent(id)
   |
   v
Backend marca evento como deletado (soft delete)
   |
   v
Modal fecha e lista é atualizada
```

### Carregamento de Imagens

As imagens são armazenadas no backend em `http://localhost:3472/assets/`:

```
EventCard precisa exibir imagem
   |
   v
Constrói URL: `http://localhost:3472/assets/images/<filename>`
   |
   v
Carrega imagem
   |
   v
Detecta proporção (vertical/horizontal/square)
   |
   v
Ajusta tamanho do card conforme proporção
```

---

## Deploy com Docker

O projeto possui um `Dockerfile` para containerização.

### Construir Imagem Docker

```bash
docker build -t event-gallery-frontend .
```

### Executar Container

```bash
docker run -p 5173:5173 event-gallery-frontend
```

### Usando Docker Compose

Do diretório raiz do projeto:

```bash
docker-compose up -d frontend
```

A aplicação estará disponível em `http://localhost:5173`

---

## Contribuindo

Se você quer contribuir para o frontend, siga estes passos:

### Fluxo de Contribuição

1. Crie uma branch para sua funcionalidade:
   ```bash
   git checkout -b feature/sua-funcionalidade
   ```

2. Faça suas mudanças

3. Teste a aplicação:
   ```bash
   npm run dev
   ```

4. Verifique qualidade do código:
   ```bash
   npm run lint
   ```

5. Commit com mensagem descritiva:
   ```bash
   git commit -m "Adiciona nova funcionalidade X"
   ```

6. Faça push:
   ```bash
   git push origin feature/sua-funcionalidade
   ```

7. Abra um Pull Request

### Padrões de Código

- Use componentes funcionais do React (hooks)
- Use nomes descritivos para variáveis e funções
- Organize imports alphabeticamente
- Use Tailwind CSS para estilização
- Crie componentes reutilizáveis quando possível
- Documente componentes complexos com comentários

### O Que Testar Antes de Fazer Push

Antes de enviar suas mudanças, teste:

1. Funcionalidade principal que você implementou
2. Autenticação (login/logout)
3. CRUD de eventos (criar, ler, atualizar, deletar)
4. CRUD de grupos
5. Upload e visualização de arquivos
6. Responsividade em diferentes tamanhos de tela
7. ESLint sem erros: `npm run lint`

---

## Hooks Customizados

### useIsMobile()

Hook que detecta se o dispositivo é móvel.

**Uso:**
```javascript
const isMobile = useIsMobile();

if (isMobile) {
  // Renderizar layout para móvel
} else {
  // Renderizar layout para desktop
}
```

---

## Funções Utilitárias

### cn() - Utility Class

Função para mesclar classes Tailwind CSS condicionalmente.

**Uso:**
```javascript
import { cn } from '@/lib/utils';

const buttonClass = cn(
  "px-4 py-2 rounded",
  isActive && "bg-blue-500"
);
```

---

## Estrutura de Dados

### Evento

```javascript
{
  id: number,
  id_req: string,              // ID único de requisição
  name: string,
  description: string,
  principal_photo: number,     // Índice da imagem principal
  images: string[],            // Nomes dos arquivos de imagem
  documents: string[],         // Nomes dos arquivos de documento
  videos: string[],            // Nomes dos arquivos de vídeo
  date_event: string,          // Data do evento (YYYY-MM-DD)
  date_creation: string,       // Data de criação
  group_id: number | null      // ID do grupo (se pertence a um)
}
```

### Grupo

```javascript
{
  id: number,
  name: string,
  description: string,
  events: (number | object)[],  // IDs de eventos ou objetos completos
  date_creation: string,         // Data de criação
  date_deletion: string | null   // Data de exclusão (soft delete)
}
```

---

## Troubleshooting

### Problema: "Cannot find module" ao rodar

**Solução:**
```bash
npm install
npm run dev
```

### Problema: Imagens não carregam

**Verificar:**
1. Backend está rodando em `http://localhost:3472`
2. Imagens existem em `backend/assets/images/`
3. Verificar console do navegador para erros de CORS

### Problema: Login não funciona

**Verificar:**
1. Backend está rodando
2. Credenciais estão corretas
3. Token está sendo armazenado em localStorage

### Problema: Erro de CORS

**Solução:**
Certifique-se de que o backend tem CORS habilitado (deve estar por padrão).

---

## Recursos Adicionais

Documentação das tecnologias principais:

- React: https://react.dev
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- Framer Motion: https://www.framer.com/motion
- Radix UI: https://www.radix-ui.com
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev
- Vite: https://vitejs.dev

---
