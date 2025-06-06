/**
 * Serviço para gerenciar usuários
 */
import apiService from './apiService';

class UsuarioService {
  /**
   * Lista todos os usuários
   */
  async listarTodos() {
    return await apiService.get('/usuarios');
  }

  /**
   * Busca um usuário por ID
   */
  async buscarPorId(id) {
    return await apiService.get(`/usuarios/${id}`);
  }

  /**
   * Cria um novo usuário
   */
  async criar(usuario) {
    const dados = {
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      idRegiao: usuario.idRegiao,
    };
    return await apiService.post('/usuarios', dados);
  }

  /**
   * Atualiza um usuário existente
   */
  async atualizar(id, usuario) {
    const dados = {
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      idRegiao: usuario.idRegiao,
    };
    return await apiService.put(`/usuarios/${id}`, dados);
  }

  /**
   * Deleta um usuário
   */
  async deletar(id) {
    return await apiService.delete(`/usuarios/${id}`);
  }

  /**
   * Valida os dados de um usuário
   */
  validarUsuario(usuario) {
    const erros = [];

    if (!usuario.nome || usuario.nome.trim() === '') {
      erros.push('Nome é obrigatório');
    }

    if (usuario.nome && usuario.nome.length > 100) {
      erros.push('Nome deve ter no máximo 100 caracteres');
    }

    if (!usuario.email || usuario.email.trim() === '') {
      erros.push('Email é obrigatório');
    }

    if (usuario.email && !this.validarEmail(usuario.email)) {
      erros.push('Email deve ter um formato válido');
    }

    if (usuario.email && usuario.email.length > 100) {
      erros.push('Email deve ter no máximo 100 caracteres');
    }

    if (!usuario.tipo) {
      erros.push('Tipo é obrigatório');
    }

    if (usuario.tipo && !['CIDADAO', 'AGENTE', 'ADMIN'].includes(usuario.tipo)) {
      erros.push('Tipo deve ser CIDADAO, AGENTE ou ADMIN');
    }

    return erros;
  }

  /**
   * Valida formato de email
   */
  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Obtém opções de tipo disponíveis
   */
  getTipoOptions() {
    return [
      { label: 'Cidadão', value: 'CIDADAO' },
      { label: 'Agente', value: 'AGENTE' },
      { label: 'Administrador', value: 'ADMIN' },
    ];
  }

  /**
   * Obtém cor baseada no tipo de usuário
   */
  getCorTipo(tipo) {
    switch (tipo) {
      case 'CIDADAO':
        return '#2196F3'; // Azul
      case 'AGENTE':
        return '#4CAF50'; // Verde
      case 'ADMIN':
        return '#FF5722'; // Vermelho-laranja
      default:
        return '#9E9E9E'; // Cinza
    }
  }

  /**
   * Obtém ícone baseado no tipo de usuário
   */
  getIconeTipo(tipo) {
    switch (tipo) {
      case 'CIDADAO':
        return 'person';
      case 'AGENTE':
        return 'shield-checkmark';
      case 'ADMIN':
        return 'settings';
      default:
        return 'person';
    }
  }

  /**
   * Formata nome para exibição
   */
  formatarNome(nome) {
    if (!nome) return '--';
    
    return nome
      .split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Obtém iniciais do nome para avatar
   */
  obterIniciais(nome) {
    if (!nome) return '??';
    
    const palavras = nome.trim().split(' ');
    if (palavras.length === 1) {
      return palavras[0].charAt(0).toUpperCase();
    }
    
    return (palavras[0].charAt(0) + palavras[palavras.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * Verifica se usuário tem permissão para ação
   */
  temPermissao(tipoUsuario, acao) {
    const permissoes = {
      'CIDADAO': ['visualizar'],
      'AGENTE': ['visualizar', 'criar', 'editar'],
      'ADMIN': ['visualizar', 'criar', 'editar', 'deletar', 'gerenciar'],
    };

    return permissoes[tipoUsuario]?.includes(acao) || false;
  }
}

const usuarioService = new UsuarioService();
export default usuarioService;

