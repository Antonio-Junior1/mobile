/**
 * Serviço de autenticação
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './apiService';
import { SECURITY_CONFIG } from '../config';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.loginAttempts = 0;
    this.lockoutUntil = null;
  }

  /**
   * Realiza login do usuário
   */
  async login(email, senha) {
    try {
      // Verificar se está bloqueado
      if (this.isLockedOut()) {
        const remainingTime = Math.ceil((this.lockoutUntil - Date.now()) / 60000);
        throw new Error(`Muitas tentativas de login. Tente novamente em ${remainingTime} minutos.`);
      }

      const response = await apiService.post("/api/auth/login", {
        email,
        senha,
      });

      // MUDANÇA: Agora a resposta é apenas o token (string), não um objeto
      if (response && typeof response === 'string') {
        const token = response;
        
        // Criar objeto de usuário simulado baseado no email
        const usuario = {
          email: email,
          nome: email.split('@')[0], // Usar parte antes do @ como nome
          tipo: 'ADMIN', // Tipo padrão
          id: 1 // ID simulado
        };

        // Salvar token e dados do usuário
        await this.saveAuthData({ token, usuario });
        
        // Configurar token no serviço de API
        apiService.setToken(token);
        
        // Resetar tentativas de login
        this.loginAttempts = 0;
        this.lockoutUntil = null;
        
        this.currentUser = usuario;
        this.isAuthenticated = true;
        
        return { token, usuario };
      } else {
        throw new Error('Resposta de login inválida');
      }
    } catch (error) {
      // Incrementar tentativas de login
      this.loginAttempts++;
      
      // Verificar se deve bloquear
      if (this.loginAttempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
        this.lockoutUntil = Date.now() + SECURITY_CONFIG.LOCKOUT_TIME;
      }
      
      console.error('Erro no login:', error);
      throw error;
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout() {
    try {
      // Limpar dados locais
      await this.clearAuthData();
      
      // Limpar token do serviço de API
      apiService.clearToken();
      
      this.currentUser = null;
      this.isAuthenticated = false;
      
      return true;
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  }

  /**
   * Registra novo usuário
   */
  async register(dadosUsuario) {
    try {
      const response = await apiService.post('/auth/register', dadosUsuario);
      
      if (response.token) {
        // Salvar token e dados do usuário
        await this.saveAuthData(response);
        
        // Configurar token no serviço de API
        apiService.setToken(response.token);
        
        this.currentUser = response.usuario;
        this.isAuthenticated = true;
        
        return response;
      } else {
        throw new Error('Resposta de registro inválida');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  /**
   * Atualiza token de acesso
   */
  async refreshToken() {
    try {
      const refreshToken = await AsyncStorage.getItem(`${SECURITY_CONFIG.STORAGE_KEY}_refresh_token`);
      
      if (!refreshToken) {
        throw new Error('Token de atualização não encontrado');
      }

      const response = await apiService.post('/auth/refresh', {
        refreshToken,
      });

      if (response.token) {
        // Atualizar token
        await AsyncStorage.setItem(`${SECURITY_CONFIG.STORAGE_KEY}_token`, response.token);
        apiService.setToken(response.token);
        
        return response.token;
      } else {
        throw new Error('Falha ao atualizar token');
      }
    } catch (error) {
      console.error('Erro ao atualizar token:', error);
      // Se falhar, fazer logout
      await this.logout();
      throw error;
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  async checkAuthStatus() {
    try {
      const token = await AsyncStorage.getItem(`${SECURITY_CONFIG.STORAGE_KEY}_token`);
      const userData = await AsyncStorage.getItem(`${SECURITY_CONFIG.STORAGE_KEY}_user`);
      
      if (token && userData) {
        // Verificar se o token não expirou
        const tokenData = await AsyncStorage.getItem(`${SECURITY_CONFIG.STORAGE_KEY}_token_expiry`);
        const expiryTime = tokenData ? parseInt(tokenData) : 0;
        
        if (Date.now() < expiryTime) {
          // Token ainda válido
          apiService.setToken(token);
          this.currentUser = JSON.parse(userData);
          this.isAuthenticated = true;
          return true;
        } else {
          // Token expirado, tentar renovar
          try {
            await this.refreshToken();
            return true;
          } catch (error) {
            // Falha ao renovar, fazer logout
            await this.logout();
            return false;
          }
        }
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      return false;
    }
  }

  /**
   * Obtém dados do usuário atual
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Verifica se está autenticado
   */
  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  /**
   * Verifica se está bloqueado por tentativas de login
   */
  isLockedOut() {
    return this.lockoutUntil && Date.now() < this.lockoutUntil;
  }

  /**
   * Salva dados de autenticação no armazenamento local
   */
  async saveAuthData(authData) {
    try {
      const expiryTime = Date.now() + SECURITY_CONFIG.TOKEN_EXPIRY_TIME;
      
      await AsyncStorage.multiSet([
        [`${SECURITY_CONFIG.STORAGE_KEY}_token`, authData.token],
        [`${SECURITY_CONFIG.STORAGE_KEY}_user`, JSON.stringify(authData.usuario)],
        [`${SECURITY_CONFIG.STORAGE_KEY}_token_expiry`, expiryTime.toString()],
      ]);
      
      if (authData.refreshToken) {
        await AsyncStorage.setItem(`${SECURITY_CONFIG.STORAGE_KEY}_refresh_token`, authData.refreshToken);
      }
    } catch (error) {
      console.error('Erro ao salvar dados de autenticação:', error);
      throw error;
    }
  }

  /**
   * Limpa dados de autenticação do armazenamento local
   */
  async clearAuthData() {
    try {
      await AsyncStorage.multiRemove([
        `${SECURITY_CONFIG.STORAGE_KEY}_token`,
        `${SECURITY_CONFIG.STORAGE_KEY}_user`,
        `${SECURITY_CONFIG.STORAGE_KEY}_token_expiry`,
        `${SECURITY_CONFIG.STORAGE_KEY}_refresh_token`,
      ]);
    } catch (error) {
      console.error('Erro ao limpar dados de autenticação:', error);
      throw error;
    }
  }

  /**
   * Valida dados de login
   */
  validateLoginData(email, senha) {
    const errors = [];

    if (!email || email.trim() === '') {
      errors.push('Email é obrigatório');
    } else if (!this.isValidEmail(email)) {
      errors.push('Email deve ter um formato válido');
    }

    if (!senha || senha.trim() === '') {
      errors.push('Senha é obrigatória');
    }
    // MUDANÇA: Remover validação de tamanho mínimo pois senha é fixa "admin"

    return errors;
  }

  /**
   * Valida dados de registro
   */
  validateRegisterData(dados) {
    const errors = [];

    if (!dados.nome || dados.nome.trim() === '') {
      errors.push('Nome é obrigatório');
    }

    if (!dados.email || dados.email.trim() === '') {
      errors.push('Email é obrigatório');
    } else if (!this.isValidEmail(dados.email)) {
      errors.push('Email deve ter um formato válido');
    }

    if (!dados.senha || dados.senha.trim() === '') {
      errors.push('Senha é obrigatória');
    } else if (dados.senha.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (dados.senha !== dados.confirmarSenha) {
      errors.push('Senhas não coincidem');
    }

    if (!dados.tipo) {
      errors.push('Tipo de usuário é obrigatório');
    }

    return errors;
  }

  /**
   * Valida formato de email
   */
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

// Instância singleton do serviço de autenticação
const authService = new AuthService();

export default authService;

