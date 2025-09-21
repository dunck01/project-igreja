import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Users,
  Calendar,
  MessageSquare,
  Camera,
  Info,
  Church,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Settings
} from 'lucide-react';

// Importar páginas admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import EventosManager from '../pages/admin/EventosManager';
import ConfiguracoesManager from '../pages/admin/ConfiguracoesManager';
import FamiliesManager from '../pages/admin/FamiliesManager';
import DepoimentosManager from '../pages/admin/DepoimentosManager';
import GaleriaManager from '../pages/admin/GaleriaManager';
import CultosManager from '../pages/admin/CultosManager';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: Home,
      path: '/admin',
      exact: true
    },
    {
      id: 'configuracoes',
      label: 'Configurações Gerais',
      icon: Settings,
      path: '/admin/configuracoes',
      submenu: [
        { label: 'Configurações do Site', path: '/admin/configuracoes' },
        { label: 'Quem Somos', path: '/admin/configuracoes/quem-somos' }
      ]
    },
    {
      id: 'eventos',
      label: 'Eventos',
      icon: Calendar,
      path: '/admin/eventos',
      submenu: [
        { label: 'Todos os Eventos', path: '/admin/eventos' },
        { label: 'Novo Evento', path: '/admin/eventos/novo' },
        { label: 'Categorias', path: '/admin/eventos/categorias' }
      ]
    },
    {
      id: 'cultos',
      label: 'Cultos e Serviços',
      icon: Church,
      path: '/admin/cultos',
      submenu: [
        { label: 'Horários dos Cultos', path: '/admin/cultos' },
        { label: 'Programação Especial', path: '/admin/cultos/especiais' }
      ]
    },
    {
      id: 'familias',
      label: 'Nossas Famílias',
      icon: Users,
      path: '/admin/familias',
      submenu: [
        { label: 'Gerenciar Famílias', path: '/admin/familias' },
        { label: 'Adicionar Família', path: '/admin/familias/nova' }
      ]
    },
    {
      id: 'depoimentos',
      label: 'Depoimentos',
      icon: MessageSquare,
      path: '/admin/depoimentos',
      submenu: [
        { label: 'Todos Depoimentos', path: '/admin/depoimentos' },
        { label: 'Novo Depoimento', path: '/admin/depoimentos/novo' }
      ]
    },
    {
      id: 'galeria',
      label: 'Galeria de Fotos',
      icon: Camera,
      path: '/admin/galeria',
      submenu: [
        { label: 'Todas as Fotos', path: '/admin/galeria' },
        { label: 'Upload de Fotos', path: '/admin/galeria/upload' },
        { label: 'Álbuns', path: '/admin/galeria/albuns' }
      ]
    }
  ];

  const isMenuActive = (item: any) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const isSubmenuActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center">
                <Church className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">Admin</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isMenuActive(item);
            const isExpanded = expandedMenus.includes(item.id);

            return (
              <div key={item.id}>
                {/* Menu Principal */}
                <div
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    if (item.submenu) {
                      toggleMenu(item.id);
                    }
                  }}
                >
                  <Link
                    to={item.path}
                    className="flex items-center flex-1"
                    onClick={(e) => {
                      if (item.submenu) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                    {sidebarOpen && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                  </Link>
                  
                  {sidebarOpen && item.submenu && (
                    <div className="ml-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>

                {/* Submenu */}
                {sidebarOpen && item.submenu && isExpanded && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`block p-2 rounded text-sm transition-colors ${
                          isSubmenuActive(subItem.path)
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Info e Logout */}
        <div className="p-4 border-t border-gray-200">
          {sidebarOpen && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Sair</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Painel Administrativo
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Bem-vindo, {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/configuracoes/*" element={<ConfiguracoesManager />} />
            <Route path="/eventos/*" element={<EventosManager />} />
            <Route path="/cultos/*" element={<CultosManager />} />
            <Route path="/familias/*" element={<FamiliesManager />} />
            <Route path="/depoimentos/*" element={<DepoimentosManager />} />
            <Route path="/galeria/*" element={<GaleriaManager />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;