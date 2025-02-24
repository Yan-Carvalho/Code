import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, QrCode, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { PlanLevel, PLAN_PRICES } from '../types/auth';

interface LocationState {
  targetPlan: PlanLevel;
}

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { upgradePlan } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [error, setError] = useState('');

  const { targetPlan } = location.state as LocationState;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment
      upgradePlan(targetPlan);
      navigate('/profile', { 
        state: { 
          paymentSuccess: true,
          message: `Plano atualizado com sucesso para ${targetPlan === 2 ? 'Pro' : 'Enterprise'}!`
        }
      });
    } catch (err) {
      setError('Erro ao processar pagamento. Por favor, tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/profile"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar para Perfil</span>
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-12">
            <h1 className="text-3xl font-bold text-white text-center">
              Upgrade para {targetPlan === 2 ? 'Pro' : 'Enterprise'}
            </h1>
            <p className="text-white text-center mt-2 text-lg">
              {PLAN_PRICES[targetPlan]}
            </p>
          </div>

          <div className="p-8">
            <div className="space-y-8">
              {/* Payment Method Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-6 border-2 rounded-lg flex flex-col items-center transition-all ${
                    paymentMethod === 'credit'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  <CreditCard className={`w-8 h-8 mb-2 ${
                    paymentMethod === 'credit' ? 'text-indigo-600' : 'text-gray-400'
                  }`} />
                  <span className="font-medium">Cartão de Crédito</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-6 border-2 rounded-lg flex flex-col items-center transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  <QrCode className={`w-8 h-8 mb-2 ${
                    paymentMethod === 'pix' ? 'text-indigo-600' : 'text-gray-400'
                  }`} />
                  <span className="font-medium">PIX</span>
                </button>
              </div>

              {/* Credit Card Form */}
              {paymentMethod === 'credit' && (
                <form onSubmit={handlePayment} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome no Cartão
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="NOME COMPLETO"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Validade
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="MM/AA"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cardCVC}
                        onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ''))}
                        maxLength={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-md transition-all ${
                      isProcessing 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:from-indigo-700 hover:to-blue-700 transform hover:scale-[1.02]'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pagar com Cartão
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* PIX Payment */}
              {paymentMethod === 'pix' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center">
                    <QrCode className="w-32 h-32 text-gray-400 mb-4" />
                    <p className="text-gray-600 text-center">
                      Escaneie o código QR com seu aplicativo de pagamento
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-700 text-sm">
                      Após o pagamento ser confirmado, seu plano será atualizado automaticamente.
                      Este processo pode levar alguns minutos.
                    </p>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-md transition-all ${
                      isProcessing 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:from-indigo-700 hover:to-blue-700 transform hover:scale-[1.02]'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verificando Pagamento...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Já realizei o pagamento
                      </>
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;