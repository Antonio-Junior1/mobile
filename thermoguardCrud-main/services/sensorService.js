/**
 * Serviço para gerenciar sensores
 */
import apiService from './apiService';

class SensorService {
  /**
   * Lista todos os sensores
   */
  async listarTodos() {
    return await apiService.get('/api/sensores');
  }

  /**
   * Lista sensores com paginação
   */
  async listarPaginado(page = 0, size = 10, sortBy = 'idSensor') {
    return await apiService.get(`/api/sensores/paginado?page=${page}&size=${size}&sortBy=${sortBy}`);
  }

  /**
   * Filtra sensores por status
   */
  async filtrarPorStatus(status, page = 0, size = 10, sortBy = 'idSensor') {
    return await apiService.get(`/api/sensores/filtro?status=${status}&page=${page}&size=${size}&sortBy=${sortBy}`);
  }

  /**
   * Busca um sensor por ID
   */
  async buscarPorId(id) {
    return await apiService.get(`/api/sensores/${id}`);
  }

  /**
   * Cria um novo sensor
   */
  async criar(sensor) {
    const dados = {
      idRegiao: sensor.idRegiao,
      modelo: sensor.modelo,
      status: sensor.status,
      dataInstalacao: sensor.dataInstalacao,
    };
    return await apiService.post("/api/sensores", dados);
  }

  /**
   * Atualiza um sensor existente
   */
  async atualizar(id, sensor) {
    const dados = {
      idRegiao: sensor.idRegiao,
      modelo: sensor.modelo,
      status: sensor.status,
      dataInstalacao: sensor.dataInstalacao,
    };
    return await apiService.put(`/api/sensores/${id}`, dados);
  }

  /**
   * Deleta um sensor
   */
  async deletar(id) {
    return await apiService.delete(`/api/sensores/${id}`);
  }

  /**
   * Valida os dados de um sensor
   */
  validarSensor(sensor) {
    const erros = [];

    if (!sensor.idRegiao) {
      erros.push('Região é obrigatória');
    }

    if (!sensor.modelo || sensor.modelo.trim() === '') {
      erros.push('Modelo é obrigatório');
    }

    if (sensor.modelo && sensor.modelo.length > 50) {
      erros.push('Modelo deve ter no máximo 50 caracteres');
    }

    if (!sensor.status) {
      erros.push('Status é obrigatório');
    }

    if (sensor.status && !['ATIVO', 'INATIVO', 'MANUTENCAO'].includes(sensor.status)) {
      erros.push('Status deve ser ATIVO, INATIVO ou MANUTENCAO');
    }

    if (!sensor.dataInstalacao) {
      erros.push('Data de instalação é obrigatória');
    }

    return erros;
  }

  /**
   * Obtém opções de status disponíveis
   */
  getStatusOptions() {
    return [
      { label: 'Ativo', value: 'ATIVO' },
      { label: 'Inativo', value: 'INATIVO' },
      { label: 'Manutenção', value: 'MANUTENCAO' },
    ];
  }
}

const sensorService = new SensorService();
export default sensorService;

