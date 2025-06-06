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
import { regiaoService } from '../../services';
import { theme } from '../../styles/theme';

const RegiaoFormScreen = ({ navigation, route }) => {
  const { regiao } = route.params || {};
  const isEditing = !!regiao;

  const [formData, setFormData] = useState({
    nome: '',
    latitude: '',
    longitude: '',
    vulnerabilidade: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && regiao) {
      setFormData({
        nome: regiao.nome || '',
        latitude: regiao.latitude?.toString() || '',
        longitude: regiao.longitude?.toString() || '',
        vulnerabilidade: regiao.vulnerabilidade?.toString() || '',
      });
    }
  }, [regiao, isEditing]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validarFormulario = () => {
    const dadosParaValidacao = {
      nome: formData.nome,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      vulnerabilidade: formData.vulnerabilidade ? parseFloat(formData.vulnerabilidade) : undefined,
    };

    const errosValidacao = regiaoService.validarRegiao(dadosParaValidacao);
    
    if (errosValidacao.length > 0) {
      const errosObj = {};
      errosValidacao.forEach(erro => {
        if (erro.includes('Nome')) errosObj.nome = erro;
        if (erro.includes('Latitude')) errosObj.latitude = erro;
        if (erro.includes('Longitude')) errosObj.longitude = erro;
        if (erro.includes('Vulnerabilidade')) errosObj.vulnerabilidade = erro;
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
        nome: formData.nome.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        vulnerabilidade: formData.vulnerabilidade ? parseFloat(formData.vulnerabilidade) : 0,
      };

      if (isEditing) {
        await regiaoService.atualizar(regiao.id, dadosParaEnvio);
        Alert.alert('Sucesso', 'Região atualizada com sucesso');
      } else {
        await regiaoService.criar(dadosParaEnvio);
        Alert.alert('Sucesso', 'Região criada com sucesso');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar região:', error);
      Alert.alert('Erro', 'Não foi possível salvar a região');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, field, placeholder, keyboardType = 'default', multiline = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          errors[field] && styles.inputError,
        ]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholderTextColor="#999"
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

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
          {isEditing ? 'Editar Região' : 'Nova Região'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderInput(
          'Nome da Região *',
          'nome',
          'Ex: Centro da Cidade',
          'default'
        )}

        {renderInput(
          'Latitude *',
          'latitude',
          'Ex: -23.5505',
          'numeric'
        )}

        {renderInput(
          'Longitude *',
          'longitude',
          'Ex: -46.6333',
          'numeric'
        )}

        {renderInput(
          'Vulnerabilidade (0-1)',
          'vulnerabilidade',
          'Ex: 0.75 (75%)',
          'numeric'
        )}

        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={20} color="#2196F3" />
          <Text style={styles.infoText}>
            A vulnerabilidade deve ser um valor entre 0 (baixa) e 1 (alta).
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
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
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
});

export default RegiaoFormScreen;

