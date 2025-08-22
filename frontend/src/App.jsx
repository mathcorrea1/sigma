import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import ToastContainer from './components/ui/Toast';
import Login from './pages/Login';
import Produtos from './pages/Produtos';
import Caixa from './pages/Caixa';

// Componente para proteger rotas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <NotificationProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/produtos" 
              element={
                <ProtectedRoute>
                  <Produtos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/caixa" 
              element={
                <ProtectedRoute>
                  <Caixa />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/produtos" replace />} />
          </Routes>
          
          {/* Toast Container */}
          <ToastContainer />
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
