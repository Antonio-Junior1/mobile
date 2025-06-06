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
import { regiaoService } from '../../services';
import { theme } from '../../styles/theme';

const RegiaoListScreen = ({ navigation, onRegiaoSelect }) => {
  const [regioes, setRegioes] = useState([]);
  const [filteredRegioes, setFilteredRegioes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    carregarRegioes();
  }, []);

  useEffect(() => {
    filtrarRegioes();
  }, [searchQuery, regioes]);

  const carregarRegioes = async () => {
    try {
      setLoading(true);
      const dados = await regiaoService.listarTodas();
      setRegioes(dados);
    } catch (error) {
      console.error('Erro ao carregar regiões:', error);
      Alert.alert('Erro', 'Não foi possível carregar as regiões');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarRegioes();
    setRefreshing(false);
  };

  const filtrarRegioes = () => {
    if (!searchQuery.trim()) {
      setFilteredRegioes(regioes);
      return;
    }

    const filtered = regioes.filter(regiao =>
      regiao.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRegioes(filtered);
  };

  const confirmarExclusao = (regiao) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir a região "${regiao.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => excluirRegiao(regiao.id) },
      ]
    );
  };

  const excluirRegiao = async (id) => {
    try {
      await regiaoService.deletar(id);
      Alert.alert('Sucesso', 'Região excluída com sucesso');
      carregarRegioes();
    } catch (error) {
      console.error('Erro ao excluir região:', error);
      Alert.alert('Erro', 'Não foi possível excluir a região');
    }
  };

  const renderRegiao = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => onRegiaoSelect ? onRegiaoSelect(item) : navigation.navigate('RegiaoDetail', { regiao: item })}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.nome}</Text>
          <View style={styles.vulnerabilidadeContainer}>
            <Text style={styles.vulnerabilidadeText}>
              Vuln: {(item.vulnerabilidade * 100).toFixed(0)}%
            </Text>
          </View>
        </View>
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemSubtitle}>
            Lat: {item.latitude.toFixed(4)}, Lng: {item.longitude.toFixed(4)}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('RegiaoForm', { regiao: item })}
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
      <Ionicons name="location-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Nenhuma região encontrada</Text>
      {searchQuery ? (
        <Text style={styles.emptySubtext}>Tente ajustar sua pesquisa</Text>
      ) : (
        <Text style={styles.emptySubtext}>Adicione uma nova região para começar</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando regiões...</Text>
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
            placeholder="Pesquisar regiões..."
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
          onPress={() => navigation.navigate('RegiaoForm')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredRegioes}
        renderItem={renderRegiao}
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
  vulnerabilidadeContainer: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vulnerabilidadeText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
  },
  itemDetails: {
    marginTop: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
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

export default RegiaoListScreen;

