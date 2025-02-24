import React, { useState, useRef, useEffect } from 'react';
import { FileText, Upload, Settings } from 'lucide-react';
import JSZip from 'jszip';
import JsBarcode from 'jsbarcode';
import { BarcodeFormat } from '../types/barcode';
import { useAuthStore } from '../store/authStore';
import { PLAN_LIMITS } from '../types/auth';

interface BarcodeGeneratorProps {
  format: BarcodeFormat;
}

interface BarcodeData {
  value: string;
  dataUrl: string;
}

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

export function BarcodeGenerator({ format }: BarcodeGeneratorProps) {
  const [error, setError] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileContent, setFileContent] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<{ start: number; end: number } | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [previewBarcodeUrl, setPreviewBarcodeUrl] = useState<string | null>(null);
  const { user } = useAuthStore();

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

  const BATCH_SIZE = 2000;
  const BATCH_DELAY = 10000;
  const PREVIEW_VALUE = format.example;

  const generateBarcode = async (value: string): Promise<string> => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", `barcode-${value}`);
    document.body.appendChild(svg);

    try {
      JsBarcode(`#barcode-${value}`, value, {
        format: format.format,
        ...barcodeOptions
      });

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      return new Promise<string>((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          document.body.removeChild(svg);
          resolve(dataUrl);
        };

        img.onerror = () => {
          document.body.removeChild(svg);
          reject(new Error(`Erro ao gerar código de barras para o valor: ${value}`));
        };

        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        img.src = URL.createObjectURL(svgBlob);
      });
    } catch (err) {
      document.body.removeChild(svg);
      console.error('Error generating barcode:', err);
      throw new Error(`Erro ao gerar código de barras para o valor: ${value}`);
    }
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
        const value = line.trim();
        if (!format.validator(value)) {
          throw new Error(`Linha inválida: "${line}". ${format.errorMessage}`);
        }
      }

      setFileContent(lines);
      setDebugInfo(`Arquivo carregado com ${lines.length} linha(s). Clique em gerar para criar os códigos de barras.`);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo');
      setFileContent([]);
    }
  };

  const handleOptionChange = (key: keyof BarcodeOptions, value: any) => {
    setBarcodeOptions(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (user?.planLevel === 3) {
      generateBarcode(PREVIEW_VALUE)
        .then(setPreviewBarcodeUrl)
        .catch(err => console.error('Error generating preview:', err));
    }
  }, [barcodeOptions, format]);

  const processBatch = async (
    startIndex: number,
    endIndex: number
  ): Promise<BarcodeData[]> => {
    const batchBarcodes: BarcodeData[] = [];
    
    for (let i = startIndex; i < endIndex && i < fileContent.length; i++) {
      const value = fileContent[i].trim();
      try {
        const dataUrl = await generateBarcode(value);
        batchBarcodes.push({
          value,
          dataUrl
        });
      } catch (error) {
        console.error(`Erro ao processar código ${value}:`, error);
        throw error;
      }
    }

    return batchBarcodes;
  };

  const downloadBatch = async (barcodes: BarcodeData[], start: number, end: number) => {
    const zip = new JSZip();
    const folderName = `${format.name} ${start} - ${end}`;
    const folder = zip.folder(folderName);

    if (!folder) {
      throw new Error('Erro ao criar pasta ZIP');
    }

    barcodes.forEach((barcode) => {
      const base64Data = barcode.dataUrl.replace(/^data:image\/png;base64,/, "");
      folder.file(`${barcode.value}.png`, base64Data, { base64: true });
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

  const generateAndDownloadBarcodes = async () => {
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
        
        const batchBarcodes = await processBatch(startIndex, endIndex);
        
        setDebugInfo(`Baixando lote ${batchNumber + 1}/${totalBatches}: códigos ${displayStart} até ${displayEnd}`);
        await downloadBatch(batchBarcodes, displayStart, displayEnd);
        
        if (batchNumber < totalBatches - 1) {
          setDebugInfo(`Lote ${batchNumber + 1} concluído. Aguardando 10 segundos antes do próximo lote...`);
          await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
        }
      }

      setDebugInfo(`Processamento concluído. Todos os ${totalItems} códigos de barras foram gerados e baixados em ${totalBatches} lotes.`);
      setCurrentBatch(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar ou baixar códigos de barras');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
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
          {format.errorMessage}
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
            <>
              {previewBarcodeUrl && (
                <div className="mb-6 p-4 bg-white border rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Visualização:</p>
                  <img
                    src={previewBarcodeUrl}
                    alt="Preview Barcode"
                    className="max-w-full h-auto mx-auto"
                  />
                </div>
              )}

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
            </>
          )}
        </div>
      )}

      {fileContent.length > 0 && (
        <button
          onClick={generateAndDownloadBarcodes}
          disabled={isProcessing}
          className={`w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-md transition-all ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-blue-700 transform hover:scale-[1.02]'
          }`}
        >
          {isProcessing ? 'Processando...' : 'Gerar e Baixar Códigos de Barras'}
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
  );
}