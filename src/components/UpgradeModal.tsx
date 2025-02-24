import React from 'react';
import { X, Check, CreditCard } from 'lucide-react';
import { PlanLevel, PLAN_PRICES } from '../types/auth';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlan: PlanLevel;
}

export function UpgradeModal({ isOpen, onClose, targetPlan }: UpgradeModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate('/payment', { state: { targetPlan } });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Upgrade para {targetPlan === 2 ? 'Pro' : 'Enterprise'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center text-2xl font-bold text-gray-900">
              <span>{PLAN_PRICES[targetPlan]}</span>
            </div>

            <ul className="space-y-3">
              {targetPlan === 2 ? (
                <>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>Até 100 códigos por lote</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>Suporte prioritário</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>Códigos ilimitados por lote</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>Suporte 24/7</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>API de integração</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <button
            onClick={handleUpgrade}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-md hover:from-indigo-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Continuar para Pagamento
          </button>
        </div>
      </div>
    </div>
  );
}