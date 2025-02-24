import { BarcodeFormat } from '../types/barcode';

export const BARCODE_FORMATS: BarcodeFormat[] = [
  {
    id: 'CODE128',
    name: 'Code 128',
    description: 'Código de barras alfanumérico de alta densidade',
    format: 'CODE128',
    validator: (value: string) => /^[\x00-\x7F]+$/.test(value),
    errorMessage: 'Deve conter apenas caracteres ASCII (letras, números e símbolos)',
    example: 'ABC-123456',
  },
  {
    id: 'ITF',
    name: 'ITF',
    description: 'Código de barras para embalagens industriais',
    format: 'ITF',
    validator: (value: string) => /^\d{12}$/.test(value),
    errorMessage: 'Deve conter exatamente 12 dígitos numéricos',
    example: '123456789012',
  },
  {
    id: 'CODE39',
    name: 'Code 39',
    description: 'Código de barras alfanumérico comum em logística',
    format: 'CODE39',
    validator: (value: string) => /^[0-9A-Z\-\.\ \$\/\+\%]+$/.test(value),
    errorMessage: 'Deve conter apenas letras maiúsculas, números e caracteres especiais (- . $ / + %)',
    example: 'CODE-39',
  },
  {
    id: 'MSI',
    name: 'MSI',
    description: 'Código de barras usado em etiquetas de prateleira',
    format: 'MSI',
    validator: (value: string) => /^\d+$/.test(value),
    errorMessage: 'Deve conter apenas dígitos numéricos',
    example: '123456',
  },
  {
    id: 'pharmacode',
    name: 'Pharmacode',
    description: 'Código de barras usado em farmácias',
    format: 'pharmacode',
    validator: (value: string) => /^\d+$/.test(value) && parseInt(value) >= 3 && parseInt(value) <= 131070,
    errorMessage: 'Deve ser um número entre 3 e 131070',
    example: '1234',
  }
];