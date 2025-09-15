import { useState } from 'react';
import { Menu, X, Church, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onNavigateToLogin?: () => void;
}

const Header = ({ onNavigateToLogin }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const mainMenuItems = [
    { href: '#inicio', label: 'Início' },
    { href: '#sobre', label: 'Quem Somos' },
    { href: '#cultos', label: 'Cultos' },
  ];

  const dropdownMenus = [
    {
      label: 'Comunidade',
      items: [
        { href: '#eventos', label: 'Eventos' },
        { href: '#familias', label: 'Nossas Famílias' },
        { href: '#depoimentos', label: 'Depoimentos' },
      ]
    },
    {
      label: 'Mídia',
      items: [
        { href: '#galeria', label: 'Galeria de Fotos' },
        { href: '#midia', label: 'Vídeos e Lives' },
      ]
    },
    {
      label: 'Contato',
      items: [
        { href: '#contato', label: 'Fale Conosco' },
      ]
    }
  ];

  const handleDropdownEnter = (label: string) => {
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-800 p-2 rounded-full">
              <Church className="h-8 w-8 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900">O Brasil Para Cristo</span>
              <span className="text-sm text-blue-800 font-medium">OBPC - Família Brasil</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:block">
            <div className="flex items-center space-x-8">
              {/* Main Menu Items */}
              {mainMenuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-800 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}

              {/* Dropdown Menus */}
              {dropdownMenus.map((dropdown) => (
                <div
                  key={dropdown.label}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(dropdown.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="flex items-center text-gray-700 hover:text-blue-800 px-3 py-2 text-sm font-medium transition-colors duration-200">
                    {dropdown.label}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>

                  {/* Dropdown Content */}
                  {activeDropdown === dropdown.label && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      {dropdown.items.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-3 text-sm text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Admin Button */}
              <button
                onClick={onNavigateToLogin}
                className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Admin
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-800 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {/* Main Items */}
              {mainMenuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-800 block px-3 py-2 text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              {/* Dropdown Items */}
              {dropdownMenus.map((dropdown) => (
                <div key={dropdown.label} className="border-t border-gray-200 pt-2 mt-2">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {dropdown.label}
                  </div>
                  {dropdown.items.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-gray-700 hover:text-blue-800 block px-6 py-2 text-base font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              ))}

              {/* Admin Button for Mobile */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <button
                  onClick={() => {
                    onNavigateToLogin?.();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 text-base font-medium transition-colors duration-200 rounded-lg mx-3"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;