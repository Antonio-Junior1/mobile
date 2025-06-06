import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { sensorService, regiaoService } from '../../services';
import { theme } from '../../styles/theme';

const SensorFormScreen = ({ navigation, route }) => {
  const { sensor } = route.params || {};
  const isEditing = !!sensor;

  const [formData, setFormData] = useState({
    modelo: '',
    status: '',
    dataInstalacao: '',
    idRegiao: '',
  });
  const [regioes, setRegioes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRegioes, setLoadingRegioes] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    carregarRegioes();
    if (isEditing && sensor) {
      setFormData({
        modelo: sensor.modelo || '',
        status: sensor.status || '',
        dataInstalacao: sensor.dataInstalacao ? new Date(sensor.dataInstalacao).toISOString().split('T')[0] : '',
        idRegiao: sensor.idRegiao || '',
      });
    }
  }, [sensor, isEditing]);

  const carregarRegioes = async () => {
    try {
      setLoadingRegioes(true);
      const dados = await regiaoService.listarTodas();
      setRegioes(dados);
    } catch (error) {
      console.error('Erro ao carregar regiões:', error);
      Alert.alert('Erro', 'Não foi possível carregar as regiões');
    } finally {
      setLoadingRegioes(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validarFormulario = () => {
    const dadosParaValidacao = {
      modelo: formData.modelo,
      status: formData.status,
      dataInstalacao: formData.dataInstalacao,
      idRegiao: formData.idRegiao,
    };

    const errosValidacao = sensorService.validarSensor(dadosParaValidacao);
    
    if (errosValidacao.length > 0) {
      const errosObj = {};
      errosValidacao.forEach(erro => {
        if (erro.includes('Modelo')) errosObj.modelo = erro;
        if (erro.includes('Status')) errosObj.status = erro;
        if (erro.includes('Data')) errosObj.dataInstalacao = erro;
        if (erro.includes('Região')) errosObj.idRegiao = erro;
      });
      setErrors(errosObj);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      Alert.alert('Erro de Validação', 'Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);
    try {
      const dadosParaEnvio = {
        modelo: formData.modelo.trim(),
        status: formData.status,
        dataInstalacao: formData.dataInstalacao,
        idRegiao: parseInt(formData.idRegiao),
      };

      if (isEditing) {
        await sensorService.atualizar(sensor.id, dadosParaEnvio);
        Alert.alert('Sucesso', 'Sensor atualizado com sucesso');
      } else {
        await sensorService.criar(dadosParaEnvio);
        Alert.alert('Sucesso', 'Sensor criado com sucesso');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar sensor:', error);
      Alert.alert('Erro', 'Não foi possível salvar o sensor');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, field, placeholder, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType}
        placeholderTextColor="#999"
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  const renderPicker = (label, field, items, placeholder) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.pickerContainer, errors[field] && styles.inputError]}>
        <RNPickerSelect
          placeholder={{ label: placeholder, value: '' }}
          items={items}
          onValueChange={(value) => handleInputChange(field, value)}
          value={formData[field]}
          style={pickerSelectStyles}
        />
      </View>
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  if (loadingRegioes) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  const regioesOptions = regioes.map(regiao => ({
    label: regiao.nome,
    value: regiao.id.toString(),
  }));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Sensor' : 'Novo Sensor'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderInput(
          'Modelo do Sensor *',
          'modelo',
          'Ex: TempSensor Pro 2024',
          'default'
        )}

        {renderPicker(
          'Região *',
          'idRegiao',
          regioesOptions,
          'Selecione uma região'
        )}

        {renderPicker(
          'Status *',
          'status',
          sensorService.getStatusOptions(),
          'Selecione o status'
        )}

        {renderInput(
          'Data de Instalação *',
          'dataInstalacao',
          'AAAA-MM-DD',
          'default'
        )}

        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={20} color="#2196F3" />
          <Text style={styles.infoText}>
            A data deve estar no formato AAAA-MM-DD (ex: 2024-06-03).
            Campos marcados com * são obrigatórios.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Atualizar' : 'Criar'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
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
    paddingHorizontal: 12,
    color: '#333',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#333',
    paddingRight: 30,
  },
});

export default SensorFormScreen;

