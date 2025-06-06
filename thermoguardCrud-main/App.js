import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, SafeAreaView, FlatList, Image, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';

// Importando a biblioteca de localização
import * as Location from 'expo-location';

// Importando a biblioteca do Mapa
import MapView, { Marker, Callout } from 'react-native-maps';

// Importando estilos e dados simulados
import { theme } from './styles/theme';
import { getTemperatureColor, getStatusColor } from './styles/colors';
import { mockLocations, mockAlerts, mockStats } from './services/mockData';

// Importando o navegador CRUD
import CrudNavigator from './components/crud/CrudNavigator';

export default function App() {
  // Estado para controlar qual tela está sendo exibida
  const [currentScreen, setCurrentScreen] = useState('Welcome');
  
  // Estados para dados e filtros
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterType, setFilterType] = useState('todos');
  const [filterRegion, setFilterRegion] = useState('todas');
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para configurações
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');
  
  // Estados para localização (do projeto base)
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [permission, setPermission] = useState(null);
  
  // Regiões únicas para filtro
  const regions = [...new Set(mockLocations.map(loc => loc.region))];
  
  // UseEffect para carregar dados simulados
  useEffect(() => {
    const loadData = async () => {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Carregar dados simulados
      setLocations(mockLocations);
      setFilteredLocations(mockLocations);
      setAlerts(mockAlerts);
      setFilteredAlerts(mockAlerts);
      setStats(mockStats);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  // UseEffect para solicitar permissão da localização (do projeto base)
  useEffect(() => {
    (async () => {
      // Solicitar permissão para acessar a localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermission(status); // Armazena o status da permissão

      // Verificar se a permissão foi concedida
      if (status === 'granted') {
        // Obter localização atual do dispositivo
        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude
        });

        // Converter latitude/longitude em um endereço (geocodificação reversa)
        const addressResult = await Location.reverseGeocodeAsync(userLocation.coords);
        setAddress(addressResult[0]); // Armazena o endereço mais relevante
      }
    })();
  }, []);
  
  // Se a permissão de localização foi negada
  if (permission !== 'granted' && currentScreen === 'Map') {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Permissão da localização não foi concedida</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => {
            (async () => {
              // Solicitar permissão para acessar a localização
              const { status } = await Location.requestForegroundPermissionsAsync();
              setPermission(status); // Armazena o status da permissão
            })();
          }}
        >
          <Text style={styles.permissionButtonText}>Solicitar Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Componente para a tela de boas-vindas
  const WelcomeScreen = () => (
    <View style={styles.welcomeContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>🌡️</Text>
      </View>
      <Text style={styles.welcomeTitle}>ThermoGuard</Text>
      <Text style={styles.welcomeSubtitle}>Sistema de Monitoramento de Temperaturas Extremas</Text>
      <Text style={styles.welcomeDescription}>
        Monitoramento em tempo real de temperaturas para proteção de populações vulneráveis
      </Text>
      <TouchableOpacity 
        style={styles.welcomeButton}
        onPress={() => setCurrentScreen('Home')}
      >
        <Text style={styles.welcomeButtonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Componente para a tela de início (antigo Dashboard)
  const HomeScreen = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      );
    }
    
    // Filtrar localizações críticas e alertas recentes
    const criticalLocations = locations.filter(loc => loc.status === 'crítico');
    const recentAlerts = alerts
      .filter(alert => !alert.resolved)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);
    
    return (
      <ScrollView style={styles.screenContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Início</Text>
          <Text style={styles.headerSubtitle}>
            Visão geral do monitoramento de temperaturas
          </Text>
        </View>
        
        {/* Resumo de estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalLocations}</Text>
              <Text style={styles.statLabel}>Locais Monitorados</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[
                styles.statValue, 
                { color: stats.activeAlerts > 0 ? theme.colors.secondary.orange : theme.colors.secondary.green }
              ]}>
                {stats.activeAlerts}
              </Text>
              <Text style={styles.statLabel}>Alertas Ativos</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={[
                styles.statValue, 
                { color: getTemperatureColor(stats.averageTemperature) }
              ]}>
                {stats.averageTemperature}°C
              </Text>
              <Text style={styles.statLabel}>Temperatura Média</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[
                styles.statValue, 
                { color: stats.criticalLocations > 0 ? theme.colors.primary.red : theme.colors.secondary.green }
              ]}>
                {stats.criticalLocations}
              </Text>
              <Text style={styles.statLabel}>Locais em Estado Crítico</Text>
            </View>
          </View>
        </View>
        
        {/* Acesso rápido ao CRUD */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Gerenciamento</Text>
          <TouchableOpacity 
            style={styles.crudButton}
            onPress={() => setCurrentScreen('CRUD')}
          >
            <View style={styles.crudButtonContent}>
              <Ionicons name="settings" size={24} color="#fff" />
              <Text style={styles.crudButtonText}>Gerenciar Dados</Text>
              <Text style={styles.crudButtonSubtext}>Regiões, Sensores, Leituras, Alertas e Usuários</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Temperaturas extremas */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Temperaturas Extremas</Text>
          <View style={styles.extremeTempsContainer}>
            <View style={styles.extremeTempCard}>
              <Text style={styles.extremeTempLabel}>Mais Alta</Text>
              <Text style={[styles.extremeTempValue, { color: theme.colors.primary.red }]}>
                {stats.highestTemperature?.value}°C
              </Text>
              <Text style={styles.extremeTempLocation}>{stats.highestTemperature?.location}</Text>
            </View>
            
            <View style={styles.extremeTempCard}>
              <Text style={styles.extremeTempLabel}>Mais Baixa</Text>
              <Text style={[styles.extremeTempValue, { color: theme.colors.primary.blue }]}>
                {stats.lowestTemperature?.value}°C
              </Text>
              <Text style={styles.extremeTempLocation}>{stats.lowestTemperature?.location}</Text>
            </View>
          </View>
        </View>
        
        {/* Alertas recentes */}
        {recentAlerts.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Alertas Recentes</Text>
            {recentAlerts.map(alert => (
              <View key={alert.id} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertLocation}>{alert.locationName}</Text>
                  <Text style={[
                    styles.alertSeverity,
                    { color: alert.severity === 'crítico' ? theme.colors.primary.red : theme.colors.secondary.orange }
                  ]}>
                    {alert.severity.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>
                  {new Date(alert.timestamp).toLocaleString('pt-BR')}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  // Componente para a tela CRUD
  const CrudScreen = () => (
    <CrudNavigator />
  );
  
  // Componente para a barra de navegação inferior
  const BottomNavigation = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'Home' && styles.navItemActive]}
        onPress={() => setCurrentScreen('Home')}
      >
        <Ionicons 
          name={currentScreen === 'Home' ? 'home' : 'home-outline'} 
          size={24} 
          color={currentScreen === 'Home' ? theme.colors.primary.blue : '#666'} 
        />
        <Text style={[
          styles.navText, 
          currentScreen === 'Home' && styles.navTextActive
        ]}>
          Início
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'CRUD' && styles.navItemActive]}
        onPress={() => setCurrentScreen('CRUD')}
      >
        <Ionicons 
          name={currentScreen === 'CRUD' ? 'settings' : 'settings-outline'} 
          size={24} 
          color={currentScreen === 'CRUD' ? theme.colors.primary.blue : '#666'} 
        />
        <Text style={[
          styles.navText, 
          currentScreen === 'CRUD' && styles.navTextActive
        ]}>
          Gerenciar
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  // Renderizar a tela atual
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'Welcome':
        return <WelcomeScreen />;
      case 'Home':
        return <HomeScreen />;
      case 'CRUD':
        return <CrudScreen />;
      default:
        return <HomeScreen />;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {renderCurrentScreen()}
      {currentScreen !== 'Welcome' && <BottomNavigation />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // Estilos da tela de boas-vindas
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.primary.blue,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoText: {
    fontSize: 80,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.9,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
    lineHeight: 24,
  },
  welcomeButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  welcomeButtonText: {
    color: theme.colors.primary.blue,
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Estilos das telas principais
  screenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  
  // Estilos das estatísticas
  statsContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary.blue,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  
  // Estilos das seções
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  
  // Estilos do botão CRUD
  crudButton: {
    backgroundColor: theme.colors.primary.blue,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  crudButtonContent: {
    flex: 1,
  },
  crudButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  crudButtonSubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  
  // Estilos das temperaturas extremas
  extremeTempsContainer: {
    flexDirection: 'row',
  },
  extremeTempCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  extremeTempLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  extremeTempValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  extremeTempLocation: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  
  // Estilos dos alertas
  alertCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertLocation: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  alertSeverity: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  alertTime: {
    fontSize: 12,
    color: '#999',
  },
  
  // Estilos da navegação inferior
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  navItemActive: {
    // Estilo para item ativo
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  navTextActive: {
    color: theme.colors.primary.blue,
    fontWeight: '600',
  },
  
  // Estilos de loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  
  // Estilos de permissão
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary.blue,
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  permissionButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

