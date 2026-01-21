'use client';

import { useState } from 'react';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { PinForm } from '@/components/admin/pin-form';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const correctPin = "28405"; // Hardcoded PIN

  const handlePinSubmit = (pin: string) => {
    if (pin === correctPin) {
      setIsAuthenticated(true);
    } else {
      alert('Неверный PIN-код');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!isAuthenticated ? (
        <PinForm onSubmit={handlePinSubmit} />
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
}
