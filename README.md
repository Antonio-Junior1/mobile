# ThermoGuard Mobile - CRUD Implementation

## Visão Geral

Este projeto implementa um sistema CRUD completo para o aplicativo ThermoGuard, permitindo o gerenciamento de:

- **Regiões**: Áreas geográficas monitoradas
- **Sensores**: Dispositivos de medição de temperatura
- **Leituras**: Dados coletados pelos sensores
- **Alertas**: Notificações de temperaturas extremas
- **Usuários**: Pessoas que utilizam o sistema

## Estrutura do Projeto

```
thermoguard-crud/
├── components/
│   └── crud/
│       ├── CrudNavigator.js      # Navegação principal do CRUD
│       ├── RegiaoListScreen.js   # Listagem de regiões
│       ├── RegiaoFormScreen.js   # Formulário de regiões
│       ├── SensorListScreen.js   # Listagem de sensores
│       └── SensorFormScreen.js   # Formulário de sensores
├── services/
│   ├── apiService.js             # Serviço base para API
│   ├── authService.js            # Serviço de autenticação
│   ├── regiaoService.js          # Serviço de regiões
│   ├── sensorService.js          # Serviço de sensores
│   ├── leituraService.js         # Serviço de leituras
│   ├── alertaService.js          # Serviço de alertas
│   ├── usuarioService.js         # Serviço de usuários
│   ├── mockData.js               # Dados simulados
│   └── index.js                  # Exportação centralizada
├── config/
│   └── index.js                  # Configurações da aplicação
├── styles/
│   ├── theme.js                  # Tema da aplicação
│   └── colors.js                 # Cores e utilitários
└── App.js                        # Componente principal
```

## Funcionalidades Implementadas

### 1. Gerenciamento de Regiões
- ✅ Listagem com busca e filtros
- ✅ Criação de novas regiões
- ✅ Edição de regiões existentes
- ✅ Exclusão de regiões
- ✅ Validação de dados (nome, coordenadas, vulnerabilidade)

### 2. Gerenciamento de Sensores
- ✅ Listagem com busca e filtros por status
- ✅ Criação de novos sensores
- ✅ Edição de sensores existentes
- ✅ Exclusão de sensores
- ✅ Validação de dados (modelo, região, status, data)

### 3. Serviços de API
- ✅ Configuração baseada em ambiente
- ✅ Tratamento de erros HTTP
- ✅ Timeout para requisições
- ✅ Autenticação JWT
- ✅ Interceptação de respostas

### 4. Autenticação
- ✅ Login e logout
- ✅ Registro de usuários
- ✅ Renovação automática de tokens
- ✅ Armazenamento seguro de credenciais
- ✅ Proteção contra ataques de força bruta

## Configuração

### URLs da API

As URLs da API são configuradas no arquivo `config/index.js`:

```javascript
// Para desenvolvimento local
DEV_API_URL: 'http://10.0.2.2:8080/api', // Android Emulator
DEV_API_URL: 'http://localhost:8080/api',  // iOS Simulator

// Para produção
PROD_API_URL: 'https://api.thermoguard.com/api'
```

### Variáveis de Ambiente

O projeto detecta automaticamente o ambiente:
- **Desenvolvimento**: Usa `DEV_API_URL`
- **Produção**: Usa `PROD_API_URL`

## Como Usar

### 1. Navegação Principal

O aplicativo possui duas telas principais:
- **Início**: Dashboard com estatísticas e visão geral
- **Gerenciar**: Acesso às funcionalidades CRUD

### 2. Funcionalidades CRUD

#### Regiões
1. Acesse "Gerenciar" → "Regiões"
2. Use o botão "+" para adicionar nova região
3. Toque em uma região para editá-la
4. Use os botões de ação para editar/excluir

#### Sensores
1. Acesse "Gerenciar" → "Sensores"
2. Use filtros por status se necessário
3. Use o botão "+" para adicionar novo sensor
4. Toque em um sensor para editá-lo

### 3. Validações

Todos os formulários possuem validações:
- **Campos obrigatórios**: Marcados com *
- **Formatos**: Email, datas, coordenadas
- **Limites**: Tamanhos de texto, valores numéricos

## Integração com Backend

### Endpoints Utilizados

```
GET    /api/regioes           # Listar regiões
POST   /api/regioes           # Criar região
PUT    /api/regioes/{id}      # Atualizar região
DELETE /api/regioes/{id}      # Deletar região

GET    /api/sensores          # Listar sensores
POST   /api/sensores          # Criar sensor
PUT    /api/sensores/{id}     # Atualizar sensor
DELETE /api/sensores/{id}     # Deletar sensor

# ... outros endpoints
```

### Autenticação

O sistema utiliza JWT (JSON Web Tokens):
1. Login retorna token de acesso
2. Token é incluído em todas as requisições
3. Renovação automática quando necessário
4. Logout limpa tokens armazenados

## Tratamento de Erros

### Tipos de Erro Tratados

- **401 Unauthorized**: Redireciona para login
- **403 Forbidden**: Mostra mensagem de acesso negado
- **404 Not Found**: Recurso não encontrado
- **422 Unprocessable Entity**: Dados inválidos
- **500 Internal Server Error**: Erro do servidor
- **Timeout**: Tempo limite excedido

### Feedback ao Usuário

- Mensagens de erro claras e em português
- Loading states durante operações
- Confirmações para ações destrutivas
- Validações em tempo real nos formulários

## Responsividade Mobile

### Características

- ✅ Interface otimizada para telas pequenas
- ✅ Botões com tamanho adequado para toque
- ✅ Navegação intuitiva
- ✅ Feedback visual para interações
- ✅ Suporte a orientação portrait/landscape

### Componentes Responsivos

- Cards com layout flexível
- Listas com scroll infinito
- Formulários com teclado adaptativo
- Modais e alertas centralizados

## Dependências Principais

```json
{
  "expo": "~53.0.9",
  "react": "19.0.0",
  "react-native": "0.79.2",
  "react-native-picker-select": "^9.3.1",
  "@react-native-async-storage/async-storage": "^1.x.x"
}
```

## Próximos Passos

### Melhorias Sugeridas

1. **Offline Support**: Cache local para funcionar sem internet
2. **Push Notifications**: Notificações para alertas críticos
3. **Geolocalização**: Integração com GPS para localização automática
4. **Gráficos**: Visualização de dados históricos
5. **Exportação**: Relatórios em PDF/Excel

### Funcionalidades Pendentes

- [ ] Telas para Leituras
- [ ] Telas para Alertas
- [ ] Telas para Usuários
- [ ] Dashboard com gráficos
- [ ] Configurações avançadas

## Troubleshooting

### Problemas Comuns

1. **Erro de conexão**: Verificar URL da API
2. **Token expirado**: Fazer logout/login novamente
3. **Dados não carregam**: Verificar conectividade
4. **Validação falha**: Verificar formato dos dados

### Logs de Debug

Para habilitar logs detalhados, configure:
```javascript
DEV_CONFIG.ENABLE_DEBUG_LOGS = true
```

## Suporte

Para dúvidas ou problemas:
1. Verificar logs do console
2. Testar conectividade com a API
3. Validar configurações de ambiente
4. Consultar documentação da API backend

