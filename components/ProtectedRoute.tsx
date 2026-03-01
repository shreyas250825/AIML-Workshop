'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated, redirect to login
        router.replace('/login');
      } else if (requireAdmin && !isAdmin) {
        // Not admin, redirect to dashboard
        router.replace('/dashboard');
      } else {
        // Authorized, allow rendering
        setShouldRender(true);
      }
    }
  }, [user, loading, isAdmin, requireAdmin, router]);

  // Show nothing while loading or unauthorized
  if (loading || !shouldRender) {
    return null;
  }

  // User is authenticated and authorized
  return <>{children}</>;
}
