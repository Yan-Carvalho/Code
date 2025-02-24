import React from 'react';
import { useAuthStore } from '../store/authStore';
import { LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PlanBadge } from './PlanBadge';

export function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end h-16 items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Link
                to="/profile"
                className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <User className="w-5 h-5 mr-2" />
                <span>{user?.displayName || user?.username}</span>
              </Link>
              {user?.planLevel && <PlanBadge planLevel={user.planLevel} />}
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}