import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Barcode } from 'lucide-react';
import { BarcodeFormatSelector } from '../components/BarcodeFormatSelector';
import { BarcodeGenerator as BarcodeGeneratorComponent } from '../components/BarcodeGenerator';
import { BARCODE_FORMATS } from '../components/BarcodeFormats';
import { BarcodeFormat } from '../types/barcode';

function BarcodeGenerator() {
  const [selectedFormat, setSelectedFormat] = useState<BarcodeFormat>(BARCODE_FORMATS[0]);

  const handleFormatChange = (format: BarcodeFormat) => {
    setSelectedFormat(format);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/home"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar para Home</span>
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-lg shadow-lg">
              <Barcode className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 ml-4">
              Gerador de Códigos de Barras
            </h1>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                1. Selecione o formato do código de barras
              </h2>
              <BarcodeFormatSelector
                selectedFormat={selectedFormat.id}
                onFormatChange={handleFormatChange}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                2. Carregue o arquivo e gere os códigos
              </h2>
              <BarcodeGeneratorComponent format={selectedFormat} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarcodeGenerator;