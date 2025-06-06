/**
 * Serviço para gerenciar regiões
 */
import apiService from './apiService';

class RegiaoService {
  /**
   * Lista todas as regiões
   */
  async listarTodas() {
    return await apiService.get('/api/regioes');
  }

  /**
   * Busca uma região por ID
   */
  async buscarPorId(id) {
    return await apiService.get(`/api/regioes/${id}`);
  }

  /**
   * Cria uma nova região
   */
  async criar(regiao) {
    const dados = {
      nome: regiao.nome,
      latitude: regiao.latitude,
      longitude: regiao.longitude,
      vulnerabilidade: regiao.vulnerabilidade,
    };
    return await apiService.post("/api/regioes", dados);
  }

  /**
   * Atualiza uma região existente
   */
  async atualizar(id, regiao) {
    const dados = {
      nome: regiao.nome,
      latitude: regiao.latitude,
      longitude: regiao.longitude,
      vulnerabilidade: regiao.vulnerabilidade,
    };
    return await apiService.put(`/api/regioes/${id}`, dados);
  }

  /**
   * Deleta uma região
   */
  async deletar(id) {
    return await apiService.delete(`/api/regioes/${id}`);
  }

  /**
   * Valida os dados de uma região
   */
  validarRegiao(regiao) {
    const erros = [];

    if (!regiao.nome || regiao.nome.trim() === '') {
      erros.push('Nome é obrigatório');
    }

    if (!regiao.latitude || isNaN(regiao.latitude)) {
      erros.push('Latitude deve ser um número válido');
    }

    if (!regiao.longitude || isNaN(regiao.longitude)) {
      erros.push('Longitude deve ser um número válido');
    }

    if (regiao.vulnerabilidade !== undefined && regiao.vulnerabilidade !== null) {
      if (isNaN(regiao.vulnerabilidade) || regiao.vulnerabilidade < 0 || regiao.vulnerabilidade > 1) {
        erros.push('Vulnerabilidade deve ser um número entre 0 e 1');
      }
    }

    return erros;
  }
}

const regiaoService = new RegiaoService();
export default regiaoService;

