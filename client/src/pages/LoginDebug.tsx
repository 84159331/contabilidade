import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const LoginDebug: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const { login } = useAuth();

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const testFunctions = async () => {
    addDebugInfo('🧪 Testando Netlify Functions...');
    
    try {
      // Teste Health
      addDebugInfo('Testando health check...');
      const healthResponse = await fetch('/.netlify/functions/health');
      const healthData = await healthResponse.json();
      addDebugInfo(`Health: ${healthResponse.status} - ${JSON.stringify(healthData)}`);
      
      // Teste Login Debug
      addDebugInfo('Testando login debug...');
      const loginResponse = await fetch('/.netlify/functions/auth-login-debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'password123'
        })
      });
      
      const loginData = await loginResponse.text();
      addDebugInfo(`Login Debug: ${loginResponse.status} - ${loginData}`);
      
      // Teste Login Original
      addDebugInfo('Testando login original...');
      const loginOriginalResponse = await fetch('/.netlify/functions/auth-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'password123'
        })
      });
      
      const loginOriginalData = await loginOriginalResponse.text();
      addDebugInfo(`Login Original: ${loginOriginalResponse.status} - ${loginOriginalData}`);
      
    } catch (error: any) {
      addDebugInfo(`❌ Erro: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    addDebugInfo('🚀 Iniciando login...');

    try {
      addDebugInfo(`Tentando login com: ${formData.username}`);
      await login(formData.username, formData.password);
      addDebugInfo('✅ Login realizado com sucesso!');
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      addDebugInfo(`❌ Erro no login: ${error.message}`);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Login Debug - Tesouraria
          </h2>
        </div>

        <button
          onClick={testFunctions}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-4"
        >
          🧪 Testar Functions
        </button>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="password123"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Fazendo login...' : 'Entrar'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h3>
          <div className="bg-gray-100 p-3 rounded-md max-h-40 overflow-y-auto text-xs">
            {debugInfo.map((info, index) => (
              <div key={index} className="mb-1">{info}</div>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p><strong>Credenciais de teste:</strong></p>
          <p>Username: <code>admin</code></p>
          <p>Password: <code>password123</code></p>
        </div>
      </div>
    </div>
  );
};

export default LoginDebug;
