import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from './config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 Firebase Auth useEffect executado');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('👤 Estado do usuário mudou:', user ? user.email : 'null');
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Iniciando login Firebase para:', email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login Firebase realizado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro no login Firebase:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      console.log('📝 Iniciando registro Firebase para:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar perfil com nome
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      
      console.log('✅ Registro Firebase realizado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro no registro Firebase:', error);
      throw new Error(error.message || 'Erro ao criar conta');
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Fazendo logout Firebase');
      await signOut(auth);
      console.log('✅ Logout Firebase realizado com sucesso');
      window.location.href = '/logout';
    } catch (error: any) {
      console.error('❌ Erro no logout Firebase:', error);
      throw new Error('Erro ao fazer logout');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
