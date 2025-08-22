import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SkipLink from '../components/ui/SkipLink';
import LanguageSelector from '../components/ui/LanguageSelector';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.username, formData.password);
      localStorage.setItem('token', response.access_token);
      navigate('/produtos');
    } catch (error) {
      setError(error.response?.data?.detail || t('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SkipLink />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" aria-hidden="true"></div>
        
        {/* Language Selector */}
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        
        <div className="relative w-full max-w-md">
          {/* Logo & Header */}
          <header className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-xl mb-6"
              role="img"
              aria-label={t('auth.system_title')}
            >
              <span className="text-white font-bold text-3xl" aria-hidden="true">Σ</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('auth.system_title')}</h1>
            <p className="text-gray-600">{t('auth.system_subtitle')}</p>
          </header>

          {/* Login Card */}
          <main id="main-content" tabIndex="-1" className="focus:outline-none">
            <Card shadow="xl" className="backdrop-blur-sm bg-white/80">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {t('auth.welcome_back')}
                </h2>
                <p className="text-gray-600">
                  {t('auth.login_subtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <Input
                  label={t('auth.username')}
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={t('auth.enter_username')}
                  autoComplete="username"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />
                
                <Input
                  label={t('auth.password')}
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('auth.enter_password')}
                  error={error}
                  autoComplete="current-password"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                />

                <Button
                  type="submit"
                  loading={isLoading}
                  size="lg"
                  className="w-full"
                  aria-label={isLoading ? t('auth.logging_in') : t('auth.login')}
                  icon={
                    !isLoading && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    )
                  }
                >
                  {isLoading ? t('auth.logging_in') : t('auth.login')}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 text-center mb-2 font-medium">
                  🚀 {t('auth.demo_credentials')}
                </p>
                <div className="flex justify-center gap-4 text-sm">
                  <span className="bg-white px-3 py-1 rounded-lg text-blue-700 font-mono">
                    admin
                  </span>
                  <span className="bg-white px-3 py-1 rounded-lg text-blue-700 font-mono">
                    123456
                  </span>
                </div>
              </div>
            </Card>
          </main>

          {/* Footer */}
          <footer className="text-center mt-8 text-sm text-gray-500">
            <p>© 2025 {t('auth.system_title')} - {t('auth.system_subtitle')}</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Login;
