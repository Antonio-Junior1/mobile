/**
 * Configurações da aplicação
 */

// Configurações da API
export const API_CONFIG = {
  // URL base da API - ajustar conforme o ambiente
  BASE_URL: 'http://10.0.2.2:8080/api',
  
  // Timeout para requisições (em milissegundos)
  TIMEOUT: 30000,
  
  // Endpoints da API
  ENDPOINTS: {
    // Autenticação
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
    },
    
    // Regiões
    REGIOES: '/regioes',
    
    // Sensores
    SENSORES: '/sensores',
    SENSORES_PAGINADO: '/sensores/paginado',
    SENSORES_FILTRO: '/sensores/filtro',
    
    // Leituras
    LEITURAS: '/leituras',
    LEITURAS_TEMPERATURA_MEDIA: '/leituras/temperatura-media-por-regiao',
    
    // Alertas
    ALERTAS: '/alertas',
    
    // Usuários
    USUARIOS: '/usuarios',
    
    // Relatórios
    RELATORIOS: '/relatorios',
  },
};

// Configurações do aplicativo
export const APP_CONFIG = {
  // Nome da aplicação
  APP_NAME: 'ThermoGuard',
  
  // Versão da aplicação
  VERSION: '1.0.0',
  
  // Configurações de cache
  CACHE: {
    // Tempo de cache para dados (em milissegundos)
    DATA_CACHE_TIME: 5 * 60 * 1000, // 5 minutos
    
    // Tempo de cache para imagens (em milissegundos)
    IMAGE_CACHE_TIME: 24 * 60 * 60 * 1000, // 24 horas
  },
  
  // Configurações de paginação
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  
  // Configurações de temperatura
  TEMPERATURE: {
    // Unidade padrão
    DEFAULT_UNIT: 'celsius',
    
    // Limites de temperatura
    LIMITS: {
      CRITICAL_HIGH: 35,
      WARNING_HIGH: 30,
      WARNING_LOW: 10,
      CRITICAL_LOW: 5,
    },
  },
  
  // Configurações de localização
  LOCATION: {
    // Precisão da localização
    ACCURACY: 'high',
    
    // Timeout para obter localização (em milissegundos)
    TIMEOUT: 15000,
    
    // Idade máxima da localização (em milissegundos)
    MAX_AGE: 60000,
  },
};

// Configurações de desenvolvimento
export const DEV_CONFIG = {
  // Habilitar logs de debug
  ENABLE_DEBUG_LOGS: __DEV__,
  
  // Habilitar dados mockados
  USE_MOCK_DATA: false,
  
  // URL da API para desenvolvimento
  DEV_API_URL: 'http://10.0.2.2:8080/api', // Para emulador Android
  
  // URL da API para produção
  PROD_API_URL: 'https://api.thermoguard.com/api',
};

// Configurações de segurança
export const SECURITY_CONFIG = {
  // Chave para armazenamento local
  STORAGE_KEY: 'thermoguard_data',
  
  // Tempo de expiração do token (em milissegundos)
  TOKEN_EXPIRY_TIME: 24 * 60 * 60 * 1000, // 24 horas
  
  // Número máximo de tentativas de login
  MAX_LOGIN_ATTEMPTS: 5,
  
  // Tempo de bloqueio após tentativas falhadas (em milissegundos)
  LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutos
};

// Configurações de notificação
export const NOTIFICATION_CONFIG = {
  // Tipos de notificação
  TYPES: {
    CRITICAL_ALERT: 'critical_alert',
    WARNING_ALERT: 'warning_alert',
    SYSTEM_UPDATE: 'system_update',
    DATA_SYNC: 'data_sync',
  },
  
  // Configurações padrão
  DEFAULT_SETTINGS: {
    CRITICAL_ALERTS: true,
    WARNING_ALERTS: true,
    SYSTEM_UPDATES: true,
    DATA_SYNC: false,
  },
};

// Exportar configuração baseada no ambiente
export const getApiUrl = () => {
  if (__DEV__) {
    return DEV_CONFIG.USE_MOCK_DATA ? null : DEV_CONFIG.DEV_API_URL;
  }
  return DEV_CONFIG.PROD_API_URL;
};

// Exportar configuração completa
export default {
  API: API_CONFIG,
  APP: APP_CONFIG,
  DEV: DEV_CONFIG,
  SECURITY: SECURITY_CONFIG,
  NOTIFICATION: NOTIFICATION_CONFIG,
  getApiUrl,
};

