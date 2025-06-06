/**
 * TempAlert Mobile - Sistema de Monitoramento de Temperaturas Extremas
 * Arquivo de cores para estilização do aplicativo
 */

// Cores primárias
const primary = {
  blue: '#1E88E5',
  red: '#E53935',
  green: '#43A047',
  yellow: '#FDD835',
};

// Cores secundárias
const secondary = {
  orange: '#FB8C00',
  purple: '#8E24AA',
  teal: '#00ACC1',
  green: '#7CB342',
};

// Cores para temperaturas
const temperature = {
  hot: '#E53935',    // Vermelho para temperaturas altas
  warm: '#FB8C00',   // Laranja para temperaturas moderadamente altas
  mild: '#7CB342',   // Verde para temperaturas amenas
  cool: '#039BE5',   // Azul claro para temperaturas moderadamente baixas
  cold: '#1565C0',   // Azul escuro para temperaturas baixas
};

// Cores para texto
const text = {
  primary: '#212121',
  secondary: '#757575',
  light: '#FFFFFF',
  disabled: '#BDBDBD',
};

// Cores para background
const background = {
  light: '#F5F5F5',
  white: '#FFFFFF',
  dark: '#303030',
};

// Cores para UI
const ui = {
  card: '#FFFFFF',
  divider: '#EEEEEE',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Função para obter cor baseada na temperatura
const getTemperatureColor = (temp) => {
  if (temp >= 35) return temperature.hot;
  if (temp >= 28) return temperature.warm;
  if (temp >= 15) return temperature.mild;
  if (temp >= 5) return temperature.cool;
  return temperature.cold;
};

// Função para obter cor baseada no status
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'crítico':
      return primary.red;
    case 'alerta':
      return secondary.orange;
    case 'normal':
      return primary.green;
    default:
      return primary.blue;
  }
};

export {
  primary,
  secondary,
  temperature,
  text,
  background,
  ui,
  getTemperatureColor,
  getStatusColor,
};
