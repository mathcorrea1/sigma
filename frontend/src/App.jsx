import { RouterProvider } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import { router } from './routes';
import ToastContainer from './components/ui/Toast';
import './styles/App.css';

function App() {
  return (
    <NotificationProvider>
      <div className="App">
        <RouterProvider router={router} />
        
        {/* Toast Container */}
        <ToastContainer />
      </div>
    </NotificationProvider>
  );
}

export default App;
