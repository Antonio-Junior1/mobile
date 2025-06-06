/**
 * Configuração base da API
 */
import { getApiUrl, API_CONFIG } from '../config';

// URL base da API - usar configuração baseada no ambiente
const API_BASE_URL = getApiUrl() || API_CONFIG.BASE_URL;

/**
 * Classe para gerenciar requisições HTTP
 */
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Define o token de autenticação
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Remove o token de autenticação
   */
  clearToken() {
    this.token = null;
  }

  /**
   * Obtém os headers padrão para requisições
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Cria um controller para timeout
   */
  createTimeoutController() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    return { controller, timeoutId };
  }

  /**
   * Trata erros de resposta da API
   */
  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Se não conseguir parsear JSON, usar mensagem padrão
      }
      
      // Tratar diferentes tipos de erro
      switch (response.status) {
        case 401:
          errorMessage = 'Não autorizado. Faça login novamente.';
          break;
        case 403:
          errorMessage = 'Acesso negado. Você não tem permissão para esta ação.';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado.';
          break;
        case 422:
          errorMessage = 'Dados inválidos. Verifique as informações enviadas.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        case 503:
          errorMessage = 'Serviço temporariamente indisponível.';
          break;
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    return response;
  }

  /**
   * Realiza requisição GET
   */
  async get(endpoint) {
    const { controller, timeoutId } = this.createTimeoutController();
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      await this.handleResponse(response);
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Tempo limite da requisição excedido');
      }
      
      console.error('Erro na requisição GET:', error);
      throw error;
    }
  }

  /**
   * Realiza requisição POST
   */
  async post(endpoint, data) {
    const { controller, timeoutId } = this.createTimeoutController();
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      await this.handleResponse(response);
      
      // POST pode retornar 201 Created sem conteúdo
      if (response.status === 201 || response.status === 204) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Tempo limite da requisição excedido');
      }
      
      console.error('Erro na requisição POST:', error);
      throw error;
    }
  }

  /**
   * Realiza requisição PUT
   */
  async put(endpoint, data) {
    const { controller, timeoutId } = this.createTimeoutController();
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      await this.handleResponse(response);
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Tempo limite da requisição excedido');
      }
      
      console.error('Erro na requisição PUT:', error);
      throw error;
    }
  }

  /**
   * Realiza requisição DELETE
   */
  async delete(endpoint) {
    const { controller, timeoutId } = this.createTimeoutController();
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      await this.handleResponse(response);

      // DELETE pode retornar 204 No Content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Tempo limite da requisição excedido');
      }
      
      console.error('Erro na requisição DELETE:', error);
      throw error;
    }
  }

  /**
   * Verifica se a API está disponível
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Erro ao verificar saúde da API:', error);
      return false;
    }
  }

  /**
   * Obtém informações da API
   */
  getApiInfo() {
    return {
      baseURL: this.baseURL,
      timeout: this.timeout,
      hasToken: !!this.token,
    };
  }
}

// Instância singleton do serviço de API
const apiService = new ApiService();

export default apiService;

