import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { authService } from '../../services';

// Importar telas CRUD
import RegiaoListScreen from './RegiaoListScreen';
import RegiaoFormScreen from './RegiaoFormScreen';
import SensorListScreen from './SensorListScreen';
import SensorFormScreen from './SensorFormScreen';
import LoginScreen from './LoginScreen';

const CrudNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [screenParams, setScreenParams] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Verificar autenticação ao iniciar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await authService.checkAuthStatus();
      if (isAuth) {
        setIsAuthenticated(true);
        setCurrentUser(authService.getCurrentUser());
        setCurrentScreen('menu');
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentUser(authService.getCurrentUser());
    setCurrentScreen('menu');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Deseja realmente sair do sistema?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              setIsAuthenticated(false);
              setCurrentUser(null);
              setCurrentScreen('login');
            } catch (error) {
              console.error('Erro no logout:', error);
            }
          }
        }
      ]
    );
  };

  // Simulação de navegação
  const navigation = {
    navigate: (screenName, params = {}) => {
      setCurrentScreen(screenName);
      setScreenParams(params);
    },
    goBack: () => {
      setCurrentScreen('menu');
      setScreenParams({});
    },
  };

  const route = {
    params: screenParams,
  };

  const menuItems = [
    {
      id: 'regioes',
      title: 'Regiões',
      subtitle: 'Gerenciar regiões monitoradas',
      icon: 'location',
      color: '#2196F3',
      screen: 'RegiaoList',
      enabled: true,
    },
    {
      id: 'sensores',
      title: 'Sensores',
      subtitle: 'Gerenciar sensores de temperatura',
      icon: 'hardware-chip',
      color: '#4CAF50',
      screen: 'SensorList',
      enabled: true,
    },
    {
      id: 'leituras',
      title: 'Leituras',
      subtitle: 'Visualizar dados dos sensores',
      icon: 'analytics',
      color: '#FF9800',
      screen: 'LeituraList',
      enabled: false,
    },
    {
      id: 'alertas',
      title: 'Alertas',
      subtitle: 'Gerenciar alertas de temperatura',
      icon: 'warning',
      color: '#F44336',
      screen: 'AlertaList',
      enabled: false,
    },
    {
      id: 'usuarios',
      title: 'Usuários',
      subtitle: 'Gerenciar usuários do sistema',
      icon: 'people',
      color: '#9C27B0',
      screen: 'UsuarioList',
      enabled: false,
    },
  ];

  const renderMenu = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Gerenciamento CRUD</Text>
            <Text style={styles.headerSubtitle}>
              Bem-vindo, {currentUser?.nome || currentUser?.email}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              !item.enabled && styles.menuItemDisabled
            ]}
            onPress={() => {
              if (item.enabled) {
                navigation.navigate(item.screen);
              } else {
                Alert.alert(
                  'Em Desenvolvimento',
                  'Esta funcionalidade será implementada em breve.'
                );
              }
            }}
          >
            <View style={[
              styles.iconContainer,
              { backgroundColor: item.enabled ? item.color : '#ccc' }
            ]}>
              <Ionicons name={item.icon} size={24} color="#fff" />
            </View>
            <View style={styles.itemContent}>
              <Text style={[
                styles.itemTitle,
                !item.enabled && styles.itemTitleDisabled
              ]}>
                {item.title}
              </Text>
              <Text style={[
                styles.itemSubtitle,
                !item.enabled && styles.itemSubtitleDisabled
              ]}>
                {item.subtitle}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={item.enabled ? "#ccc" : "#ddd"} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderScreen = () => {
    if (!isAuthenticated) {
      return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
      case 'menu':
        return renderMenu();
      case 'RegiaoList':
        return <RegiaoListScreen navigation={navigation} />;
      case 'RegiaoForm':
        return <RegiaoFormScreen navigation={navigation} route={route} />;
      case 'SensorList':
        return <SensorListScreen navigation={navigation} />;
      case 'SensorForm':
        return <SensorFormScreen navigation={navigation} route={route} />;
      default:
        return renderMenu();
    }
  };

  return renderScreen();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: theme.colors.primary.red,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemDisabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemTitleDisabled: {
    color: '#999',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  itemSubtitleDisabled: {
    color: '#bbb',
  },
});

export default CrudNavigator;

