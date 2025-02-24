import React from 'react';
import { Crown, Award, Medal } from 'lucide-react';
import { PlanLevel } from '../types/auth';

interface PlanBadgeProps {
  planLevel: PlanLevel;
}

const plans = {
  1: {
    name: 'Basic',
    icon: Medal,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  2: {
    name: 'Pro',
    icon: Award,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  3: {
    name: 'Enterprise',
    icon: Crown,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
} as const;

export function PlanBadge({ planLevel }: PlanBadgeProps) {
  // Ensure planLevel is valid
  if (!(planLevel in plans)) {
    console.error(`Invalid plan level: ${planLevel}`);
    return null;
  }

  const plan = plans[planLevel];
  const Icon = plan.icon;

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full ${plan.bgColor} ${plan.color} text-sm font-medium`}>
      <Icon className="w-4 h-4 mr-1" />
      {plan.name}
    </div>
  );
}