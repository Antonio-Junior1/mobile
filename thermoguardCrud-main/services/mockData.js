/**
 * TempAlert Mobile - Sistema de Monitoramento de Temperaturas Extremas
 * Dados simulados para demonstração do aplicativo
 */

// Dados simulados de localizações monitoradas
const mockLocations = [
  {
    id: 'loc1',
    name: 'Centro Comunitário Vila Nova',
    latitude: -23.5505,
    longitude: -46.6333,
    region: 'Zona Sul',
    currentTemperature: 38,
    feelsLike: 40,
    humidity: 65,
    windSpeed: 12,
    altitude: 760,
    status: 'crítico',
    lastUpdate: new Date().getTime() - 1000 * 60 * 15, // 15 minutos atrás
  },
  {
    id: 'loc2',
    name: 'Abrigo Municipal Esperança',
    latitude: -23.5605,
    longitude: -46.6233,
    region: 'Zona Leste',
    currentTemperature: 32,
    feelsLike: 34,
    humidity: 70,
    windSpeed: 8,
    altitude: 780,
    status: 'alerta',
    lastUpdate: new Date().getTime() - 1000 * 60 * 5, // 5 minutos atrás
  },
  {
    id: 'loc3',
    name: 'Asilo São Francisco',
    latitude: -23.5705,
    longitude: -46.6433,
    region: 'Zona Norte',
    currentTemperature: 28,
    feelsLike: 30,
    humidity: 75,
    windSpeed: 5,
    altitude: 800,
    status: 'normal',
    lastUpdate: new Date().getTime() - 1000 * 60 * 10, // 10 minutos atrás
  },
  {
    id: 'loc4',
    name: 'Centro de Acolhimento Luz',
    latitude: -23.5305,
    longitude: -46.6133,
    region: 'Centro',
    currentTemperature: 4,
    feelsLike: 2,
    humidity: 85,
    windSpeed: 15,
    altitude: 750,
    status: 'crítico',
    lastUpdate: new Date().getTime() - 1000 * 60 * 8, // 8 minutos atrás
  },
  {
    id: 'loc5',
    name: 'Comunidade Vila Esperança',
    latitude: -23.5805,
    longitude: -46.6533,
    region: 'Zona Oeste',
    currentTemperature: 8,
    feelsLike: 6,
    humidity: 80,
    windSpeed: 10,
    altitude: 790,
    status: 'alerta',
    lastUpdate: new Date().getTime() - 1000 * 60 * 3, // 3 minutos atrás
  },
  {
    id: 'loc6',
    name: 'Hospital Comunitário São José',
    latitude: -23.5405,
    longitude: -46.6633,
    region: 'Zona Sul',
    currentTemperature: 22,
    feelsLike: 22,
    humidity: 60,
    windSpeed: 7,
    altitude: 770,
    status: 'normal',
    lastUpdate: new Date().getTime() - 1000 * 60 * 12, // 12 minutos atrás
  },
];

// Dados simulados de alertas
const mockAlerts = [
  {
    id: 'alert1',
    locationId: 'loc1',
    locationName: 'Centro Comunitário Vila Nova',
    type: 'alta', // alta ou baixa temperatura
    temperature: 38,
    severity: 'crítico', // crítico ou alerta
    message: 'Temperatura extremamente alta detectada. Risco para idosos e crianças.',
    timestamp: new Date().getTime() - 1000 * 60 * 30, // 30 minutos atrás
    resolved: false,
    resolvedAt: null,
  },
  {
    id: 'alert2',
    locationId: 'loc4',
    locationName: 'Centro de Acolhimento Luz',
    type: 'baixa', // alta ou baixa temperatura
    temperature: 4,
    severity: 'crítico', // crítico ou alerta
    message: 'Temperatura extremamente baixa detectada. Risco de hipotermia.',
    timestamp: new Date().getTime() - 1000 * 60 * 45, // 45 minutos atrás
    resolved: false,
    resolvedAt: null,
  },
  {
    id: 'alert3',
    locationId: 'loc2',
    locationName: 'Abrigo Municipal Esperança',
    type: 'alta', // alta ou baixa temperatura
    temperature: 32,
    severity: 'alerta', // crítico ou alerta
    message: 'Temperatura elevada detectada. Monitorar idosos e crianças.',
    timestamp: new Date().getTime() - 1000 * 60 * 60, // 1 hora atrás
    resolved: false,
    resolvedAt: null,
  },
  {
    id: 'alert4',
    locationId: 'loc5',
    locationName: 'Comunidade Vila Esperança',
    type: 'baixa', // alta ou baixa temperatura
    temperature: 8,
    severity: 'alerta', // crítico ou alerta
    message: 'Temperatura baixa detectada. Monitorar pessoas vulneráveis.',
    timestamp: new Date().getTime() - 1000 * 60 * 90, // 1.5 horas atrás
    resolved: false,
    resolvedAt: null,
  },
  {
    id: 'alert5',
    locationId: 'loc3',
    locationName: 'Asilo São Francisco',
    type: 'alta', // alta ou baixa temperatura
    temperature: 31,
    severity: 'alerta', // crítico ou alerta
    message: 'Temperatura elevada detectada. Monitorar idosos.',
    timestamp: new Date().getTime() - 1000 * 60 * 120, // 2 horas atrás
    resolved: true,
    resolvedAt: new Date().getTime() - 1000 * 60 * 60, // 1 hora atrás
  },
  {
    id: 'alert6',
    locationId: 'loc6',
    locationName: 'Hospital Comunitário São José',
    type: 'baixa', // alta ou baixa temperatura
    temperature: 10,
    severity: 'alerta', // crítico ou alerta
    message: 'Temperatura baixa detectada. Monitorar pacientes.',
    timestamp: new Date().getTime() - 1000 * 60 * 180, // 3 horas atrás
    resolved: true,
    resolvedAt: new Date().getTime() - 1000 * 60 * 90, // 1.5 horas atrás
  },
];

// Dados simulados de estatísticas
const mockStats = {
  totalLocations: mockLocations.length,
  activeAlerts: mockAlerts.filter(alert => !alert.resolved).length,
  criticalLocations: mockLocations.filter(loc => loc.status === 'crítico').length,
  averageTemperature: Math.round(
    mockLocations.reduce((sum, loc) => sum + loc.currentTemperature, 0) / mockLocations.length
  ),
  highestTemperature: {
    value: Math.max(...mockLocations.map(loc => loc.currentTemperature)),
    location: mockLocations.reduce((prev, current) => 
      (prev.currentTemperature > current.currentTemperature) ? prev : current
    ).name,
  },
  lowestTemperature: {
    value: Math.min(...mockLocations.map(loc => loc.currentTemperature)),
    location: mockLocations.reduce((prev, current) => 
      (prev.currentTemperature < current.currentTemperature) ? prev : current
    ).name,
  },
  lastUpdate: new Date().getTime(),
};

export { mockLocations, mockAlerts, mockStats };
