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
import AdminPanel from './components/admin/AdminPanel';
import RegistrationConfirmation from './components/registration/RegistrationConfirmation';

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'admin' | 'admin-panel' | 'confirmation'>('main');

  const renderView = () => {
    switch (currentView) {
      case 'admin':
        return <AdminDashboard />;
      case 'admin-panel':
        return <AdminPanel />;
      case 'confirmation':
        return <RegistrationConfirmation />;
      default:
        return (
          <>
            <Header />
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
            onClick={() => setCurrentView('main')}
            className={`px-3 py-1 text-sm rounded ${currentView === 'main' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Site
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className={`px-3 py-1 text-sm rounded ${currentView === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Inscrições
          </button>
          <button
            onClick={() => setCurrentView('admin-panel')}
            className={`px-3 py-1 text-sm rounded ${currentView === 'admin-panel' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Personalizar
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