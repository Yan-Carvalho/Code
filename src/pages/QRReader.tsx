import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, ScanLine, Copy, Check } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRReader() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);
    setIsScanning(true);

    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione um arquivo de imagem válido');
      }

      const qrScanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 1000,
      }, false);

      scannerRef.current = qrScanner;

      qrScanner.render(
        (decodedText) => {
          setResult(decodedText);
          setIsScanning(false);
          if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
          }
        },
        (errorMessage) => {
          console.error(errorMessage);
          setError('Não foi possível ler o QR code na imagem');
          setIsScanning(false);
          if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
          }
        }
      );

      const imageFile = file;
      qrScanner.scanFile(imageFile, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar imagem');
      setIsScanning(false);
    }
  };

  const copyToClipboard = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        setError('Erro ao copiar para a área de transferência');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
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
              <ScanLine className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 ml-4">
              Leitor de QR Code
            </h1>
          </div>

          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Clique ou arraste uma imagem com QR code aqui
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Formatos suportados: JPG, PNG, GIF
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {isScanning && (
              <div className="text-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Analisando imagem...</p>
              </div>
            )}

            <div id="reader" className="hidden"></div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                <p className="font-medium">Erro:</p>
                <p>{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-700">Conteúdo do QR Code:</h3>
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-gray-800 break-all font-mono bg-white p-3 rounded border border-gray-200">
                  {result}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRReader;