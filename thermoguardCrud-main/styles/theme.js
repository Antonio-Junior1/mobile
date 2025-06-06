/**
 * TempAlert Mobile - Sistema de Monitoramento de Temperaturas Extremas
 * Arquivo de tema para estilização do aplicativo
 */

import { primary, secondary, text, background, ui, temperature } from './colors';

// Definição do tema do aplicativo
const theme = {
  colors: {
    primary,
    secondary,
    text,
    background,
    ui,
    temperature, // Adicionando o objeto temperature ao theme.colors
  },
  
  // Espaçamentos
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Bordas e arredondamentos
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 999,
  },
  
  // Sombras
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    strong: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
  
  // Tipografia
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      caption: 12,
      body: 14,
      button: 16,
      title: 18,
      h3: 20,
      h2: 24,
      h1: 30,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },
  
  // Animações
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
  },
};

export { theme };
