import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Barcode, Download, Settings } from 'lucide-react';
import { BarcodeFormatSelector } from '../components/BarcodeFormatSelector';
import { BARCODE_FORMATS } from '../components/BarcodeFormats';
import { BarcodeFormat } from '../types/barcode';
import { useAuthStore } from '../store/authStore';
import JsBarcode from 'jsbarcode';

interface BarcodeOptions {
  width: number;
  height: number;
  displayValue: boolean;
  fontOptions: string;
  font: string;
  textAlign: 'left' | 'center' | 'right';
  textPosition: 'top' | 'bottom';
  textMargin: number;
  fontSize: number;
  background: string;
  lineColor: string;
  margin: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
}

function SingleBarcodeGenerator() {
  const { user } = useAuthStore();
  const [selectedFormat, setSelectedFormat] = useState<BarcodeFormat>(BARCODE_FORMATS[0]);
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [barcodeDataUrl, setBarcodeDataUrl] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const barcodeRef = useRef<HTMLDivElement>(null);

  const [barcodeOptions, setBarcodeOptions] = useState<BarcodeOptions>({
    width: 2,
    height: 100,
    displayValue: true,
    fontOptions: '',
    font: 'monospace',
    textAlign: 'center',
    textPosition: 'bottom',
    textMargin: 2,
    fontSize: 20,
    background: '#ffffff',
    lineColor: '#000000',
    margin: 10,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  });

  const handleFormatChange = (format: BarcodeFormat) => {
    setSelectedFormat(format);
    setIsValid(format.validator(inputValue));
    if (format.validator(inputValue)) {
      generateBarcode(inputValue, format);
    } else {
      setBarcodeDataUrl(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const valid = selectedFormat.validator(value);
    setIsValid(valid);
    if (valid) {
      generateBarcode(value, selectedFormat);
    } else {
      setBarcodeDataUrl(null);
    }
  };

  const handleOptionChange = (key: keyof BarcodeOptions, value: any) => {
    setBarcodeOptions(prev => {
      const newOptions = { ...prev, [key]: value };
      if (isValid) {
        generateBarcode(inputValue, selectedFormat, newOptions);
      }
      return newOptions;
    });
  };

  const generateBarcode = async (value: string, format: BarcodeFormat, options: BarcodeOptions = barcodeOptions) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "temp-barcode");
    document.body.appendChild(svg);

    try {
      JsBarcode("#temp-barcode", value, {
        format: format.format,
        ...options,
        valid: function(valid: boolean) {
          setIsValid(valid);
        }
      });

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        setBarcodeDataUrl(canvas.toDataURL('image/png'));
        document.body.removeChild(svg);
      };

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      img.src = URL.createObjectURL(svgBlob);
    } catch (err) {
      document.body.removeChild(svg);
      console.error('Error generating barcode:', err);
      setBarcodeDataUrl(null);
    }
  };

  const downloadBarcode = () => {
    if (!barcodeDataUrl) return;

    const link = document.createElement('a');
    link.href = barcodeDataUrl;
    link.download = `barcode-${selectedFormat.id}-${inputValue}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
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
              Gerador de Código de Barras Individual
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
                2. Digite o código
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="barcode-input" className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedFormat.errorMessage}
                  </label>
                  <input
                    id="barcode-input"
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={`Exemplo: ${selectedFormat.example}`}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      inputValue
                        ? isValid
                          ? 'border-green-500 focus:ring-green-200'
                          : 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-blue-200'
                    }`}
                  />
                </div>

                {user?.planLevel === 3 && (
                  <div className="border-t pt-6">
                    <button
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                      className="flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
                    >
                      <Settings className="w-5 h-5 mr-2" />
                      {showAdvancedOptions ? 'Ocultar opções avançadas' : 'Mostrar opções avançadas'}
                    </button>

                    {showAdvancedOptions && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Largura da barra
                          </label>
                          <input
                            type="number"
                            value={barcodeOptions.width}
                            onChange={(e) => handleOptionChange('width', Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Altura
                          </label>
                          <input
                            type="number"
                            value={barcodeOptions.height}
                            onChange={(e) => handleOptionChange('height', Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mostrar valor
                          </label>
                          <select
                            value={barcodeOptions.displayValue.toString()}
                            onChange={(e) => handleOptionChange('displayValue', e.target.value === 'true')}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="true">Sim</option>
                            <option value="false">Não</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fonte
                          </label>
                          <select
                            value={barcodeOptions.font}
                            onChange={(e) => handleOptionChange('font', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="monospace">Monospace</option>
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="sans-serif">Sans-serif</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alinhamento do texto
                          </label>
                          <select
                            value={barcodeOptions.textAlign}
                            onChange={(e) => handleOptionChange('textAlign', e.target.value as 'left' | 'center' | 'right')}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="left">Esquerda</option>
                            <option value="center">Centro</option>
                            <option value="right">Direita</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Posição do texto
                          </label>
                          <select
                            value={barcodeOptions.textPosition}
                            onChange={(e) => handleOptionChange('textPosition', e.target.value as 'top' | 'bottom')}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="top">Topo</option>
                            <option value="bottom">Base</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Margem do texto
                          </label>
                          <input
                            type="number"
                            value={barcodeOptions.textMargin}
                            onChange={(e) => handleOptionChange('textMargin', Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tamanho da fonte
                          </label>
                          <input
                            type="number"
                            value={barcodeOptions.fontSize}
                            onChange={(e) => handleOptionChange('fontSize', Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cor de fundo
                          </label>
                          <input
                            type="color"
                            value={barcodeOptions.background}
                            onChange={(e) => handleOptionChange('background', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md h-10"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cor das linhas
                          </label>
                          <input
                            type="color"
                            value={barcodeOptions.lineColor}
                            onChange={(e) => handleOptionChange('lineColor', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md h-10"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Margem geral
                          </label>
                          <input
                            type="number"
                            value={barcodeOptions.margin}
                            onChange={(e) => handleOptionChange('margin', Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Margem superior
                          </label>
                          <input
                            type="number"
                            value={barcodeOptions.marginTop}
                            onChange={(e) => handleOptionChange('marginTop', Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Margem inferior
                          </label>
                          <input
                            type="number"
                            value={barcodeOptions.marginBottom}
                            onChange={(e) => handleOptionChange('marginBottom', Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Margem esquerda
                          </label>
                          <input
                            type="number"
                            value={barcodeOptions.marginLeft}
                            onChange={(e) => handleOptionChange('marginLeft', Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Margem direita
                          </label>
                          <input
                            type="number"
                            value={barcodeOptions.marginRight}
                            onChange={(e) => handleOptionChange('marginRight', Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {barcodeDataUrl && (
                  <div className="space-y-4">
                    <div className="p-4 bg-white border rounded-lg shadow-sm">
                      <img
                        src={barcodeDataUrl}
                        alt="Generated Barcode"
                        className="max-w-full h-auto mx-auto"
                      />
                    </div>
                    <button
                      onClick={downloadBarcode}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-md hover:from-indigo-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Baixar Código de Barras
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleBarcodeGenerator;