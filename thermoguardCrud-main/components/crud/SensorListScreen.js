import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { sensorService, regiaoService } from '../../services';
import { theme } from '../../styles/theme';

const SensorListScreen = ({ navigation, onSensorSelect }) => {
  const [sensores, setSensores] = useState([]);
  const [filteredSensores, setFilteredSensores] = useState([]);
  const [regioes, setRegioes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    filtrarSensores();
  }, [searchQuery, statusFilter, sensores]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [sensoresData, regioesData] = await Promise.all([
        sensorService.listarTodos(),
        regiaoService.listarTodas(),
      ]);
      setSensores(sensoresData);
      setRegioes(regioesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  };

  const filtrarSensores = () => {
    let filtered = sensores;

    if (searchQuery.trim()) {
      filtered = filtered.filter(sensor =>
        sensor.modelo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(sensor => sensor.status === statusFilter);
    }

    setFilteredSensores(filtered);
  };

  const confirmarExclusao = (sensor) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir o sensor "${sensor.modelo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => excluirSensor(sensor.id) },
      ]
    );
  };

  const excluirSensor = async (id) => {
    try {
      await sensorService.deletar(id);
      Alert.alert('Sucesso', 'Sensor excluído com sucesso');
      carregarDados();
    } catch (error) {
      console.error('Erro ao excluir sensor:', error);
      Alert.alert('Erro', 'Não foi possível excluir o sensor');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ATIVO':
        return '#4CAF50';
      case 'INATIVO':
        return '#F44336';
      case 'MANUTENCAO':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ATIVO':
        return 'checkmark-circle';
      case 'INATIVO':
        return 'close-circle';
      case 'MANUTENCAO':
        return 'construct';
      default:
        return 'help-circle';
    }
  };

  const getNomeRegiao = (idRegiao) => {
    const regiao = regioes.find(r => r.id === idRegiao);
    return regiao ? regiao.nome : 'Região não encontrada';
  };

  const renderSensor = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => onSensorSelect ? onSensorSelect(item) : navigation.navigate('SensorDetail', { sensor: item })}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.modelo}</Text>
          <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status) }]}>
            <Ionicons name={getStatusIcon(item.status)} size={16} color="#fff" />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemSubtitle}>
            <Ionicons name="location" size={14} color="#666" /> {getNomeRegiao(item.idRegiao)}
          </Text>
          <Text style={styles.itemSubtitle}>
            <Ionicons name="calendar" size={14} color="#666" /> Instalado em: {new Date(item.dataInstalacao).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('SensorForm', { sensor: item })}
        >
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => confirmarExclusao(item)}
        >
          <Ionicons name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="hardware-chip-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Nenhum sensor encontrado</Text>
      {searchQuery || statusFilter ? (
        <Text style={styles.emptySubtext}>Tente ajustar seus filtros</Text>
      ) : (
        <Text style={styles.emptySubtext}>Adicione um novo sensor para começar</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando sensores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por modelo..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('SensorForm')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por status:</Text>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            placeholder={{ label: 'Todos os status', value: '' }}
            items={sensorService.getStatusOptions()}
            onValueChange={setStatusFilter}
            value={statusFilter}
            style={pickerSelectStyles}
          />
        </View>
      </View>

      <FlatList
        data={filteredSensores}
        renderItem={renderSensor}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 12,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
  },
  itemContent: {
    flex: 1,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  itemDetails: {
    marginTop: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemActions: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#333',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#333',
    paddingRight: 30,
  },
});

export default SensorListScreen;

