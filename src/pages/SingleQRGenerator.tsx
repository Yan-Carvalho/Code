import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, QrCode, Upload, Download, Trash, Circle, Square } from 'lucide-react';
import QRCode from 'qrcode';

type LogoShape = 'original' | 'circle' | 'square';

function SingleQRGenerator() {
  const [qrValue, setQrValue] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [logoShape, setLogoShape] = useState<LogoShape>('original');
  const [logoSize, setLogoSize] = useState(20); // percentage of QR code size
  const logoInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = async () => {
    if (!qrValue) {
      setError('Por favor, insira um valor para gerar o QR code');
      return;
    }

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Clear canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Generate QR code
      await QRCode.toCanvas(canvas, qrValue, {
        width: 400,
        margin: 2,
        color: {
          dark: foregroundColor,
          light: '#FFFFFF',
        },
      });

      // If there's a logo, add it to the center
      if (logo) {
        const img = new Image();
        img.onload = () => {
          const size = canvas.width * (logoSize / 100);
          const centerX = (canvas.width - size) / 2;
          const centerY = (canvas.height - size) / 2;

          // Create temporary canvas for logo manipulation
          const logoCanvas = document.createElement('canvas');
          logoCanvas.width = size;
          logoCanvas.height = size;
          const logoCtx = logoCanvas.getContext('2d');
          if (!logoCtx) return;

          if (logoShape === 'circle') {
            logoCtx.beginPath();
            logoCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            logoCtx.closePath();
            logoCtx.clip();
          } else if (logoShape === 'square') {
            logoCtx.beginPath();
            logoCtx.rect(0, 0, size, size);
            logoCtx.closePath();
            logoCtx.clip();
          }

          // Draw logo on temporary canvas
          logoCtx.fillStyle = '#FFFFFF';
          logoCtx.fillRect(0, 0, size, size);
          
          // Calculate dimensions to maintain aspect ratio
          const scale = Math.min(size / img.width, size / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          const x = (size - scaledWidth) / 2;
          const y = (size - scaledHeight) / 2;
          
          logoCtx.drawImage(img, x, y, scaledWidth, scaledHeight);

          // Create white background for logo
          ctx.fillStyle = '#FFFFFF';
          if (logoShape === 'circle') {
            ctx.beginPath();
            ctx.arc(centerX + size / 2, centerY + size / 2, (size / 2) + 5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(centerX - 5, centerY - 5, size + 10, size + 10);
          }

          // Draw processed logo
          ctx.drawImage(logoCanvas, centerX, centerY);
          setQrDataUrl(canvas.toDataURL('image/png'));
        };
        img.src = logo;
      } else {
        setQrDataUrl(canvas.toDataURL('image/png'));
      }

      setError('');
    } catch (err) {
      setError('Erro ao gerar QR code');
      console.error(err);
    }
  };

  useEffect(() => {
    if (qrValue) {
      generateQRCode();
    }
  }, [qrValue, foregroundColor, logo, logoShape, logoSize]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem válido');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setLogo(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const downloadQRCode = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
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
              <QrCode className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 ml-4">
              Gerador de QR Code Individual
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo do QR Code
                </label>
                <input
                  type="text"
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Digite o texto ou URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor do QR Code
                </label>
                <input
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="w-full h-10 px-2 py-1 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logotipo (opcional)
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-indigo-500 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">Escolher logo</span>
                  </button>
                  {logo && (
                    <button
                      onClick={removeLogo}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {logo && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Forma do Logotipo
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        onClick={() => setLogoShape('original')}
                        className={`p-4 border-2 rounded-lg flex flex-col items-center ${
                          logoShape === 'original'
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-200'
                        }`}
                      >
                        <Square className="w-6 h-6 mb-2" />
                        <span className="text-sm">Original</span>
                      </button>
                      <button
                        onClick={() => setLogoShape('circle')}
                        className={`p-4 border-2 rounded-lg flex flex-col items-center ${
                          logoShape === 'circle'
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-200'
                        }`}
                      >
                        <Circle className="w-6 h-6 mb-2" />
                        <span className="text-sm">Círculo</span>
                      </button>
                      <button
                        onClick={() => setLogoShape('square')}
                        className={`p-4 border-2 rounded-lg flex flex-col items-center ${
                          logoShape === 'square'
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-200'
                        }`}
                      >
                        <Square className="w-6 h-6 mb-2" fill="currentColor" />
                        <span className="text-sm">Quadrado</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tamanho do Logotipo ({logoSize}%)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="30"
                      value={logoSize}
                      onChange={(e) => setLogoSize(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                  {error}
                </div>
              )}

              {qrDataUrl && (
                <button
                  onClick={downloadQRCode}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-md hover:from-indigo-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Baixar QR Code
                </button>
              )}
            </div>

            {/* Right Column - Preview */}
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8">
              <canvas ref={canvasRef} className="hidden" />
              {qrDataUrl ? (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <img
                    src={qrDataUrl}
                    alt="Generated QR Code"
                    className="max-w-full h-auto"
                  />
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Digite algo para gerar o QR code</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleQRGenerator;