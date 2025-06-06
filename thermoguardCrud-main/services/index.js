/**
 * Exportação centralizada de todos os serviços
 */

import apiService from './apiService';
import authService from './authService';
import regiaoService from './regiaoService';
import sensorService from './sensorService';
import leituraService from './leituraService';
import alertaService from './alertaService';
import usuarioService from './usuarioService';

// Manter dados mockados para fallback
export { mockLocations, mockAlerts, mockStats } from './mockData';

// Exportar serviços da API
export {
  apiService,
  authService,
  regiaoService,
  sensorService,
  leituraService,
  alertaService,
  usuarioService,
};

// Exportação padrão com todos os serviços
export default {
  api: apiService,
  auth: authService,
  regiao: regiaoService,
  sensor: sensorService,
  leitura: leituraService,
  alerta: alertaService,
  usuario: usuarioService,
};

