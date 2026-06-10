import { useState } from 'react';
import { LogIn, Eye, EyeOff, Lock } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';

interface Props {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAdmin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(username, password)) {
      onLogin();
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Machado Imóveis" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-white">Área Administrativa</h1>
          <p className="text-gray-400 text-sm mt-1">Faça login para gerenciar os imóveis</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Usuário</label>
            <input
              type="text"
              required
              placeholder="admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="input-field"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field pr-12"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              <Lock className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <button type="submit" className="btn-primary w-full justify-center py-3">
            <LogIn className="w-4 h-4" />
            Entrar
          </button>
          <p className="text-xs text-gray-400 text-center">
            Credenciais padrão: admin / machado2024
          </p>
        </form>
      </div>
    </div>
  );
}
