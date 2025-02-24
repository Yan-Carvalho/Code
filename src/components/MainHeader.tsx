import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Barcode, Menu, X } from 'lucide-react';

export function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Only show header on landing page and when authenticated
  if (location.pathname !== '/' && location.pathname !== '/login') {
    return null;
  }

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Barcode className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">CodeMaster</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('beneficios')} className="text-gray-600 hover:text-gray-900">Benefícios</button>
            <button onClick={() => scrollToSection('recursos')} className="text-gray-600 hover:text-gray-900">Recursos</button>
            <button onClick={() => scrollToSection('precos')} className="text-gray-600 hover:text-gray-900">Preços</button>
            <button onClick={() => scrollToSection('contato')} className="text-gray-600 hover:text-gray-900">Contato</button>
          </nav>
          
          {/* Desktop Login Button */}
          <div className="hidden md:block">
            <button 
              onClick={handleLogin}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Acessar Sistema
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`
            md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
          `}
        >
          <div className="px-4 py-3 space-y-3">
            <button
              onClick={() => scrollToSection('beneficios')}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
            >
              Benefícios
            </button>
            <button
              onClick={() => scrollToSection('recursos')}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
            >
              Recursos
            </button>
            <button
              onClick={() => scrollToSection('precos')}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
            >
              Preços
            </button>
            <button
              onClick={() => scrollToSection('contato')}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
            >
              Contato
            </button>
            <button
              onClick={handleLogin}
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Acessar Sistema
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}