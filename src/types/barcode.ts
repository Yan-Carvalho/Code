export interface BarcodeFormat {
  id: string;
  name: string;
  description: string;
  format: string;
  validator: (value: string) => boolean;
  errorMessage: string;
  example: string;
}