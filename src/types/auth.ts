export type PlanLevel = 1 | 2 | 3;

export interface User {
  username: string;
  displayName?: string;
  email?: string;
  planLevel: PlanLevel;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => boolean;
  upgradePlan: (newPlanLevel: PlanLevel) => void;
  updateUsername: (currentPassword: string, newUsername: string) => boolean;
}

export const PLAN_LIMITS = {
  1: 10,    // Basic plan: 10 codes per batch
  2: 100,   // Pro plan: 100 codes per batch
  3: Infinity // Enterprise plan: unlimited codes
} as const;

export const PLAN_PRICES = {
  2: 'R$ 29,90/mês',  // Pro plan price
  3: 'R$ 99,90/mês'   // Enterprise plan price
} as const;

export const PLAN_FEATURES = {
  1: {
    name: 'Basic',
    features: [
      'Até 10 códigos por lote',
      'Gerador de código individual',
      'Suporte básico por email',
      'Exportação em PNG',
      'Validação em tempo real'
    ]
  },
  2: {
    name: 'Pro',
    features: [
      'Até 100 códigos por lote',
      'Todas as features do Basic',
      'Suporte prioritário',
      'Exportação em múltiplos formatos',
      'Personalização avançada',
      'Histórico de geração'
    ]
  },
  3: {
    name: 'Enterprise',
    features: [
      'Códigos ilimitados por lote',
      'Todas as features do Pro',
      'Suporte 24/7',
      'API de integração',
      'Dashboard analytics',
      'Múltiplos usuários',
      'Personalização total'
    ]
  }
} as const;