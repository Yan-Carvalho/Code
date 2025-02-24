import React from 'react';
import { BARCODE_FORMATS } from './BarcodeFormats';
import { BarcodeFormat } from '../types/barcode';

interface BarcodeFormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: BarcodeFormat) => void;
}

export function BarcodeFormatSelector({ selectedFormat, onFormatChange }: BarcodeFormatSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {BARCODE_FORMATS.map((format) => (
        <div
          key={format.id}
          onClick={() => onFormatChange(format)}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedFormat === format.id
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 hover:border-indigo-200'
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-900">{format.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{format.description}</p>
          <div className="mt-2 text-xs">
            <span className="text-gray-500">Exemplo: </span>
            <code className="bg-gray-100 px-2 py-1 rounded">{format.example}</code>
          </div>
        </div>
      ))}
    </div>
  );
}