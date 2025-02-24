import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ArrowRight, Sparkles, Barcode } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                Ferramentas Inteligentes
              </span>
              <br />
              para sua Produtividade
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              Simplifique seus processos e aumente sua eficiência com nossas ferramentas profissionais
            </p>
            <div className="flex items-center justify-center space-x-4 mb-12">
              <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
              <span className="text-sm font-medium text-gray-600">
                Ferramentas profissionais para seu negócio
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nossas Ferramentas
          </h2>
          <div className="flex items-center justify-center mb-4">
            <div className="h-1 w-20 bg-indigo-600 rounded-full" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore nossa coleção de ferramentas desenvolvidas para otimizar seus processos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* QR Code Generator Card */}
          <Link 
            to="/qr-generator"
            className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-lg shadow-lg">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transform transition-transform group-hover:translate-x-1" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Gerador de QR Code em Lote
              </h2>
              <p className="text-gray-600 mb-6">
                Gere QR codes em lote a partir de uma lista de números, com hash de segurança personalizado.
              </p>
              <div className="flex items-center text-sm text-indigo-600 font-semibold">
                <span>Acessar ferramenta</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Single QR Code Generator Card */}
          <Link 
            to="/single-qr-generator"
            className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-lg shadow-lg">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transform transition-transform group-hover:translate-x-1" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Gerador de QR Code Individual
              </h2>
              <p className="text-gray-600 mb-6">
                Crie QR codes personalizados com cores e logotipo.
              </p>
              <div className="flex items-center text-sm text-indigo-600 font-semibold">
                <span>Acessar ferramenta</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Barcode Generator Card */}
          <Link 
            to="/barcode-generator"
            className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-lg shadow-lg">
                  <Barcode className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transform transition-transform group-hover:translate-x-1" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Gerador de Código de Barras em Lote
              </h2>
              <p className="text-gray-600 mb-6">
                Gere códigos de barras em lote a partir de uma lista de números.
              </p>
              <div className="flex items-center text-sm text-indigo-600 font-semibold">
                <span>Acessar ferramenta</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Single Barcode Generator Card */}
          <Link 
            to="/single-barcode-generator"
            className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-lg shadow-lg">
                  <Barcode className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transform transition-transform group-hover:translate-x-1" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Gerador de Código de Barras Individual
              </h2>
              <p className="text-gray-600 mb-6">
                Gere códigos de barras individuais com validação em tempo real.
              </p>
              <div className="flex items-center text-sm text-indigo-600 font-semibold">
                <span>Acessar ferramenta</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/50 border-t border-gray-100 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2025 Ferramentas de Produtividade. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;