import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthHandler from '../handlers/auth';

// Lazy loading das páginas
import { lazy, Suspense } from 'react';
import Loading from '../components/ui/Loading';

// Páginas com lazy loading
const Login = lazy(() => import('../pages/Login'));
const Produtos = lazy(() => import('../pages/Produtos'));
const Caixa = lazy(() => import('../pages/Caixa'));

/**
 * Componente para proteger rotas que requerem autenticação
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthHandler.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
};

/**
 * Componente para rotas públicas (redireciona se já autenticado)
 */
const PublicRoute = ({ children }) => {
  const isAuthenticated = AuthHandler.isAuthenticated();
  
  if (isAuthenticated) {
    return <Navigate to="/produtos" replace />;
  }
  
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
};

/**
 * Configuração das rotas da aplicação
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/produtos" replace />
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: '/produtos',
    element: (
      <ProtectedRoute>
        <Produtos />
      </ProtectedRoute>
    )
  },
  {
    path: '/caixa',
    element: (
      <ProtectedRoute>
        <Caixa />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/produtos" replace />
  }
]);

/**
 * Definição das rotas da aplicação
 */
export const routes = {
  HOME: '/',
  LOGIN: '/login',
  PRODUTOS: '/produtos',
  CAIXA: '/caixa'
};

/**
 * Links de navegação para o menu
 */
export const navigationLinks = [
  {
    key: 'produtos',
    path: routes.PRODUTOS,
    labelKey: 'navigation.products',
    icon: 'package'
  },
  {
    key: 'caixa',
    path: routes.CAIXA,
    labelKey: 'navigation.cashier',
    icon: 'calculator'
  }
];

export default router;
