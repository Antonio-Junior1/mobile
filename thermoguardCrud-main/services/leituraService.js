/**
 * Serviço para gerenciar leituras
 */
import apiService from './apiService';

class LeituraService {
  /**
   * Lista todas as leituras
   */
  async listarTodas() {
    return await apiService.get('/leituras');
  }

  /**
   * Busca uma leitura por ID
   */
  async buscarPorId(id) {
    return await apiService.get(`/leituras/${id}`);
  }

  /**
   * Cria uma nova leitura
   */
  async criar(leitura) {
    const dados = {
      idSensor: leitura.idSensor,
      temperatura: leitura.temperatura,
      umidade: leitura.umidade,
      dataHora: leitura.dataHora,
    };
    return await apiService.post('/leituras', dados);
  }

  /**
   * Deleta uma leitura
   */
  async deletar(id) {
    return await apiService.delete(`/leituras/${id}`);
  }

  /**
   * Obtém temperatura média por região
   */
  async obterTemperaturaMediaPorRegiao() {
    return await apiService.get('/leituras/temperatura-media-por-regiao');
  }

  /**
   * Valida os dados de uma leitura
   */
  validarLeitura(leitura) {
    const erros = [];

    if (!leitura.idSensor) {
      erros.push('Sensor é obrigatório');
    }

    if (!leitura.temperatura && leitura.temperatura !== 0) {
      erros.push('Temperatura é obrigatória');
    }

    if (leitura.temperatura && isNaN(leitura.temperatura)) {
      erros.push('Temperatura deve ser um número válido');
    }

    if (!leitura.umidade && leitura.umidade !== 0) {
      erros.push('Umidade é obrigatória');
    }

    if (leitura.umidade && isNaN(leitura.umidade)) {
      erros.push('Umidade deve ser um número válido');
    }

    if (leitura.umidade && (leitura.umidade < 0 || leitura.umidade > 100)) {
      erros.push('Umidade deve estar entre 0 e 100%');
    }

    if (!leitura.dataHora) {
      erros.push('Data e hora são obrigatórias');
    }

    return erros;
  }

  /**
   * Formata temperatura para exibição
   */
  formatarTemperatura(temperatura, unidade = 'celsius') {
    if (temperatura === null || temperatura === undefined) {
      return '--';
    }

    if (unidade === 'fahrenheit') {
      const fahrenheit = (temperatura * 9/5) + 32;
      return `${fahrenheit.toFixed(1)}°F`;
    }

    return `${temperatura.toFixed(1)}°C`;
  }

  /**
   * Formata umidade para exibição
   */
  formatarUmidade(umidade) {
    if (umidade === null || umidade === undefined) {
      return '--';
    }

    return `${umidade.toFixed(1)}%`;
  }

  /**
   * Converte data/hora para formato ISO para envio à API
   */
  formatarDataHoraParaAPI(dataHora) {
    if (dataHora instanceof Date) {
      return dataHora.toISOString().slice(0, 19); // Remove timezone info
    }
    return dataHora;
  }

  /**
   * Converte data/hora da API para objeto Date
   */
  formatarDataHoraDaAPI(dataHora) {
    if (typeof dataHora === 'string') {
      return new Date(dataHora);
    }
    return dataHora;
  }
}

const leituraService = new LeituraService();
export default leituraService;

