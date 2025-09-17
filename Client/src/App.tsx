import { useState } from 'react';
import Header from './components/layout/Header';
import Hero from './components/layout/Hero';
import About from './components/pages/About';
import Services from './components/pages/Services';
import Events from './components/pages/Events';
import Families from './components/pages/Families';
import Gallery from './components/pages/Gallery';
import Media from './components/pages/Media';
import Testimonials from './components/pages/Testimonials';
import Contact from './components/pages/Contact';
import Footer from './components/layout/Footer';
import AdminDashboard from './components/registration/AdminDashboard';
import RegistrationConfirmation from './components/registration/RegistrationConfirmation';
import LoginComponent from './components/LoginComponent';
import { LoginResponse } from './services/authService';

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'admin' | 'confirmation' | 'login'>('main');

  const handleLogin = (response: LoginResponse) => {
    console.log('Usuário logado:', response.user);
    setCurrentView('admin'); // Redireciona para o dashboard após login
  };

  const renderView = () => {
    switch (currentView) {
      case 'admin':
        return <AdminDashboard />;
      case 'confirmation':
        return <RegistrationConfirmation />;
      case 'login':
        return <LoginComponent onLogin={handleLogin} />;
      default:
        return (
          <>
            <Header onNavigateToLogin={() => setCurrentView('login')} />
            <Hero />
            <About />
            <Services />
            <Events />
            <Families />
            <Gallery />
            <Media />
            <Testimonials />
            <Contact />
            <Footer />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navegação Admin (temporária para demonstração) */}
      <div className="fixed top-4 right-4 z-50 bg-white p-2 rounded-lg shadow-lg border">
        <div className="flex space-x-2">
                    <button
            onClick={() => setCurrentView('login')}
            className={`px-3 py-1 rounded text-sm ${
              currentView === 'login' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setCurrentView('main')}
            className={`px-3 py-1 rounded text-sm ${
              currentView === 'main' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Site
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className={`px-3 py-1 text-sm rounded ${currentView === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Admin
          </button>
          <button
            onClick={() => setCurrentView('confirmation')}
            className={`px-3 py-1 text-sm rounded ${currentView === 'confirmation' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Confirmação
          </button>
        </div>
      </div>

      {renderView()}
    </div>
  );
}

export default App;