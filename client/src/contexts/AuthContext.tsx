import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthContext useEffect executado');
    const token = localStorage.getItem('token');
    console.log('🔑 Token encontrado no localStorage:', token);
    
    // Verificação de token comentada - usando Firebase Auth
    /*
    if (token) {
      console.log('🔍 Verificando token...');
      authAPI.verifyToken()
        .then((response) => {
          console.log('✅ Token verificado com sucesso:', response.data);
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error('❌ Erro na verificação do token:', error);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log('❌ Nenhum token encontrado');
      setLoading(false);
    }
    */
    
    // Usar Firebase Auth em vez de verificação de token
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // Login comentado - usando Firebase Auth diretamente
    throw new Error('Use Firebase Auth diretamente');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
