import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, DollarSign, LogOut } from 'lucide-react';
import Button from './ui/Button';
import LanguageSelector from './ui/LanguageSelector';

const Header = ({ title, onLogout }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const navigation = [
    { name: t('navigation.products'), href: '/produtos', icon: Package },
    { name: t('navigation.cashier'), href: '/caixa', icon: DollarSign }
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center"
                role="img"
                aria-label={t('auth.system_title')}
              >
                <span className="text-white font-bold text-lg" aria-hidden="true">Σ</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('auth.system_title')}</h1>
                <p className="text-xs text-gray-500 hidden sm:block">{title}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1" aria-label={t('accessibility.menu')}>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200 ease-in-out
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <IconComponent className="w-5 h-5" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile Navigation */}
            <nav className="md:hidden flex items-center space-x-1" aria-label={t('accessibility.menu')}>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      p-2 rounded-lg text-sm
                      ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}
                    `}
                    aria-label={item.name}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <IconComponent className="w-5 h-5" />
                  </Link>
                );
              })}
            </nav>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Logout */}
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              aria-label={t('navigation.logout')}
              icon={<LogOut className="w-4 h-4" />}
              className="hidden sm:flex"
            >
              {t('navigation.logout')}
            </Button>
            
            {/* Mobile Logout */}
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="sm:hidden p-2"
              aria-label={t('navigation.logout')}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
