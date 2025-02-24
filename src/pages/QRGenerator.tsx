import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Upload, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import CryptoJS from 'crypto-js';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { useAuthStore } from '../store/authStore';
import { PLAN_LIMITS } from '../types/auth';

interface QRCodeData {
  url: string;
  qrDataUrl: string;
  number: string;
}

function QRGenerator() {
  const [error, setError] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileContent, setFileContent] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<{ start: number; end: number } | null>(null);
  const { user } = useAuthStore();

  const BATCH_SIZE = 2000;
  const BATCH_DELAY = 10000;

  const generateHash = (number: string, password: string) => {
    const combinedString = number + password;
    return CryptoJS.SHA256(combinedString).toString();
  };

  const generateQRCode = async (url: string, number: string): Promise<string> => {
    // First generate the QR code
    const qrCanvas = document.createElement('canvas');
    await QRCode.toCanvas(qrCanvas, url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    // Create a new canvas with extra space for the number
    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d')!;
    
    // Set dimensions to accommodate QR code and text
    finalCanvas.width = qrCanvas.width;
    finalCanvas.height = qrCanvas.height + 40; // Extra space for text
    
    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    
    // Draw QR code
    ctx.drawImage(qrCanvas, 0, 0);
    
    // Add text
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(number, finalCanvas.width / 2, qrCanvas.height + 10);

    return finalCanvas.toDataURL('image/png');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const limit = PLAN_LIMITS[user.planLevel];
      if (lines.length > limit) {
        throw new Error(`Seu plano permite processar até ${limit} códigos por vez. O arquivo contém ${lines.length} códigos.`);
      }

      for (const line of lines) {
        const number = line.replace(/\s/g, '');
        if (!/^\d+$/.test(number)) {
          throw new Error(`Linha contém caracteres inválidos: "${line}"`);
        }
      }

      setFileContent(lines);
      setDebugInfo(`Arquivo carregado com ${lines.length} linha(s). Digite a senha para gerar os QR codes.`);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo');
      setFileContent([]);
    }
  };

  const processBatch = async (
    startIndex: number,
    endIndex: number,
    password: string
  ): Promise<QRCodeData[]> => {
    const batchQRCodes: QRCodeData[] = [];
    
    for (let i = startIndex; i < endIndex; i++) {
      const number = fileContent[i].replace(/\s/g, '');
      const hash = generateHash(number, password);
      const url = `https://check.vant.plus/${number}-${hash}`;
      const qrDataUrl = await generateQRCode(url, number);
      
      batchQRCodes.push({
        url,
        qrDataUrl,
        number
      });
    }

    return batchQRCodes;
  };

  const downloadBatch = async (qrCodes: QRCodeData[], batchNumber: number, start: number, end: number) => {
    const zip = new JSZip();
    const folderName = `QR Codes ${start} - ${end}`;
    const folder = zip.folder(folderName);

    if (!folder) {
      throw new Error('Erro ao criar pasta ZIP');
    }

    const sortedQRCodes = qrCodes.sort((a, b) => parseInt(a.number) - parseInt(b.number));

    sortedQRCodes.forEach((qrCode) => {
      const base64Data = qrCode.qrDataUrl.replace(/^data:image\/png;base64,/, "");
      folder.file(`qrcode_${qrCode.number}.png`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${folderName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const generateAndDownloadQRCodes = async () => {
    if (!password) {
      setError('Por favor, digite uma senha para gerar os QR codes');
      return;
    }

    if (fileContent.length === 0) {
      setError('Por favor, carregue um arquivo primeiro');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');

      const totalItems = fileContent.length;
      const totalBatches = Math.ceil(totalItems / BATCH_SIZE);

      for (let batchNumber = 0; batchNumber < totalBatches; batchNumber++) {
        const startIndex = batchNumber * BATCH_SIZE;
        const endIndex = Math.min(startIndex + BATCH_SIZE, totalItems);
        const displayStart = startIndex + 1;
        const displayEnd = endIndex;
        
        setCurrentBatch({ start: displayStart, end: displayEnd });
        setDebugInfo(`Processando lote ${batchNumber + 1}/${totalBatches}: códigos ${displayStart} até ${displayEnd}`);
        
        const batchQRCodes = await processBatch(
          startIndex,
          endIndex,
          password
        );
        
        setDebugInfo(`Baixando lote ${batchNumber + 1}/${totalBatches}: códigos ${displayStart} até ${displayEnd}`);
        await downloadBatch(batchQRCodes, batchNumber + 1, displayStart, displayEnd);
        
        if (batchNumber < totalBatches - 1) {
          setDebugInfo(`Lote ${batchNumber + 1} concluído. Aguardando 10 segundos antes do próximo lote...`);
          await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
        }
      }

      setDebugInfo(`Processamento concluído. Todos os ${totalItems} QR codes foram gerados e baixados em ${totalBatches} lotes.`);
      setCurrentBatch(null);
    } catch (err) {
      setError('Erro ao gerar ou baixar QR codes');
      console.error(err);
    } finally {
      setIsProcessing(false);
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
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 ml-4">
              Gerador de QR Codes
            </h1>
          </div>

          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Clique ou arraste seu arquivo de texto aqui
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Cada linha do arquivo deve conter apenas números
              </p>
              {user && (
                <p className="text-sm font-medium text-indigo-600 mt-2">
                  Seu plano permite até {PLAN_LIMITS[user.planLevel] === Infinity ? 'ilimitados' : PLAN_LIMITS[user.planLevel]} códigos por vez
                </p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha para geração do hash
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-10 py-2"
                  placeholder="Digite a senha"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {fileContent.length > 0 && (
              <button
                onClick={generateAndDownloadQRCodes}
                disabled={isProcessing}
                className={`w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-md transition-all ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-blue-700 transform hover:scale-[1.02]'
                }`}
              >
                {isProcessing ? 'Processando...' : 'Gerar e Baixar QR Codes'}
              </button>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                <p className="font-medium">Erro:</p>
                <p>{error}</p>
              </div>
            )}

            {(debugInfo || currentBatch) && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="font-medium text-gray-700 mb-2">Informações:</p>
                <pre className="whitespace-pre-wrap text-sm text-gray-600 font-mono">
                  {debugInfo}
                  {currentBatch && (
                    `\nProcessando códigos ${currentBatch.start} até ${currentBatch.end}`
                  )}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRGenerator;