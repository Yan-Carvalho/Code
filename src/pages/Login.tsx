import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Lock, User, LogIn, Crown, Award, Medal } from 'lucide-react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/home';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    const success = login(username, password);
    if (!success) {
      setError('Usuário ou senha inválidos');
    } else {
      navigate(from);
    }
  };

  const plans = [
    {
      name: 'Basic',
      icon: Medal,
      color: 'text-gray-600',
      bgColor: 'from-gray-500 to-gray-600',
      credentials: { user: 'basic', pass: 'basic123' },
      features: ['Até 10 códigos por lote', 'Gerador individual', 'Suporte básico']
    },
    {
      name: 'Pro',
      icon: Award,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-blue-600',
      credentials: { user: 'pro', pass: 'pro123' },
      features: ['Até 100 códigos por lote', 'Gerador individual', 'Suporte prioritário']
    },
    {
      name: 'Enterprise',
      icon: Crown,
      color: 'text-indigo-600',
      bgColor: 'from-indigo-500 to-indigo-600',
      credentials: { user: 'enterprise', pass: 'enterprise123' },
      features: ['Códigos ilimitados por lote', 'Gerador individual', 'Suporte 24/7']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu plano
          </h1>
          <p className="text-lg text-gray-600">
            Selecione o plano que melhor atende às suas necessidades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div key={plan.name} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className={`p-6 bg-gradient-to-r ${plan.bgColor} text-white`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{plan.name}</h2>
                    <Icon className="w-8 h-8" />
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-4 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Credenciais de teste:</p>
                    <p className="text-sm font-mono">
                      Usuário: <span className="text-indigo-600">{plan.credentials.user}</span>
                    </p>
                    <p className="text-sm font-mono">
                      Senha: <span className="text-indigo-600">{plan.credentials.pass}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-lg shadow-lg">
              <LogIn className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 ml-4">
              Login
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Digite seu usuário"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-md hover:from-indigo-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;