/**
 * Serviço para gerenciar alertas
 */
import apiService from './apiService';

class AlertaService {
  /**
   * Lista todos os alertas
   */
  async listarTodos() {
    return await apiService.get('/alertas');
  }

  /**
   * Busca um alerta por ID
   */
  async buscarPorId(id) {
    return await apiService.get(`/alertas/${id}`);
  }

  /**
   * Cria um novo alerta
   */
  async criar(alerta) {
    const dados = {
      idRegiao: alerta.idRegiao,
      tipo: alerta.tipo,
      severidade: alerta.severidade,
      dataHora: alerta.dataHora,
      mensagem: alerta.mensagem,
    };
    return await apiService.post('/alertas', dados);
  }

  /**
   * Deleta um alerta
   */
  async deletar(id) {
    return await apiService.delete(`/alertas/${id}`);
  }

  /**
   * Valida os dados de um alerta
   */
  validarAlerta(alerta) {
    const erros = [];

    if (!alerta.idRegiao) {
      erros.push('Região é obrigatória');
    }

    if (!alerta.tipo) {
      erros.push('Tipo é obrigatório');
    }

    if (alerta.tipo && !['CALOR', 'FRIO'].includes(alerta.tipo)) {
      erros.push('Tipo deve ser CALOR ou FRIO');
    }

    if (!alerta.severidade) {
      erros.push('Severidade é obrigatória');
    }

    if (alerta.severidade && !['BAIXA', 'MEDIA', 'ALTA'].includes(alerta.severidade)) {
      erros.push('Severidade deve ser BAIXA, MEDIA ou ALTA');
    }

    if (!alerta.dataHora) {
      erros.push('Data e hora são obrigatórias');
    }

    if (!alerta.mensagem || alerta.mensagem.trim() === '') {
      erros.push('Mensagem é obrigatória');
    }

    if (alerta.mensagem && alerta.mensagem.length > 200) {
      erros.push('Mensagem deve ter no máximo 200 caracteres');
    }

    return erros;
  }

  /**
   * Obtém opções de tipo disponíveis
   */
  getTipoOptions() {
    return [
      { label: 'Calor', value: 'CALOR' },
      { label: 'Frio', value: 'FRIO' },
    ];
  }

  /**
   * Obtém opções de severidade disponíveis
   */
  getSeveridadeOptions() {
    return [
      { label: 'Baixa', value: 'BAIXA' },
      { label: 'Média', value: 'MEDIA' },
      { label: 'Alta', value: 'ALTA' },
    ];
  }

  /**
   * Obtém cor baseada na severidade
   */
  getCorSeveridade(severidade) {
    switch (severidade) {
      case 'BAIXA':
        return '#4CAF50'; // Verde
      case 'MEDIA':
        return '#FF9800'; // Laranja
      case 'ALTA':
        return '#F44336'; // Vermelho
      default:
        return '#9E9E9E'; // Cinza
    }
  }

  /**
   * Obtém ícone baseado no tipo
   */
  getIconeTipo(tipo) {
    switch (tipo) {
      case 'CALOR':
        return 'thermometer-plus';
      case 'FRIO':
        return 'thermometer-minus';
      default:
        return 'thermometer';
    }
  }

  /**
   * Formata data/hora para exibição
   */
  formatarDataHora(dataHora) {
    if (!dataHora) return '--';
    
    const data = new Date(dataHora);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
   * Gera mensagem automática baseada no tipo e severidade
   */
  gerarMensagemAutomatica(tipo, severidade, temperatura = null) {
    const tipoTexto = tipo === 'CALOR' ? 'alta' : 'baixa';
    const severidadeTexto = severidade === 'ALTA' ? 'extremamente' : 
                           severidade === 'MEDIA' ? 'moderadamente' : '';
    
    let mensagem = `Temperatura ${severidadeTexto} ${tipoTexto} detectada`;
    
    if (temperatura !== null) {
      mensagem += ` (${temperatura}°C)`;
    }

    if (severidade === 'ALTA') {
      mensagem += '. Ação imediata necessária.';
    } else if (severidade === 'MEDIA') {
      mensagem += '. Monitoramento recomendado.';
    } else {
      mensagem += '. Situação sob controle.';
    }

    return mensagem;
  }
}

const alertaService = new AlertaService();
export default alertaService;

