import React from 'react';
import { Church, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Church className="h-8 w-8 text-yellow-400" />
              <div className="flex flex-col">
                <span className="font-bold text-xl">O Brasil Para Cristo</span>
                <span className="text-sm text-gray-400">OBPC - Família Brasil</span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Uma família unida pela fé, transformando vidas através do amor de Cristo. 
              Venha fazer parte desta família e experimente o amor verdadeiro de Deus.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-pink-600 hover:bg-pink-700 p-2 rounded-full transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors duration-300">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              {['Início', 'Quem Somos', 'Cultos', 'Eventos', 'Nossas Famílias', 'Galeria', 'Mídia', 'Depoimentos'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(/\s+/g, '-').replace('nossas-', '').replace('mídia', 'midia')}`}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">Rua das Flores, 123<br />Centro - Cidade, Estado</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">(11) 1234-5678</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">contato@obpcfamiliabrasil.com.br</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 O Brasil Para Cristo - OBPC Família Brasil. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Desenvolvido com ❤️ para a glória de Deus
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;