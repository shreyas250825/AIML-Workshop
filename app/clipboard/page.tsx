'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { caseStudyData } from '@/lib/caseStudyData';

function ClipboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [copiedPassword, setCopiedPassword] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  // Simple hash function for passcode validation
  const hashPasscode = (passcode: string): string => {
    let hash = 0;
    for (let i = 0; i < passcode.length; i++) {
      const char = passcode.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  };

  // Hashed passcode for "181818" = 1456060725
  const VALID_PASSCODE_HASH = '1456060725';

  // Removed auto-authentication - require password every time

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (hashPasscode(passcode) === VALID_PASSCODE_HASH) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid passcode!');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePasswordsLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    router.push('/dashboard');
  };

  const copyToClipboard = (password: string, id: string) => {
    navigator.clipboard.writeText(password);
    setCopiedPassword(id);
    setTimeout(() => setCopiedPassword(null), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
            <p className="text-gray-600">Enter passcode to view step passwords</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleAuthenticate}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Unlock Passwords
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/dashboard" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI Workshop Platform
              </h1>
              <p className="text-sm text-gray-600">
                Welcome, {user?.name}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">
                Case Studies
              </Link>
              <Link href="/leaderboard" className="text-gray-600 hover:text-purple-600 transition-colors">
                Leaderboard
              </Link>
              <Link href="/quiz" className="text-gray-600 hover:text-purple-600 transition-colors">
                Quiz
              </Link>
              <Link href="/doubts" className="text-gray-600 hover:text-purple-600 transition-colors">
                Doubts
              </Link>
              <Link href="/materials" className="text-gray-600 hover:text-purple-600 transition-colors">
                Materials
              </Link>
              <Link href="/clipboard" className="text-purple-600 font-semibold">
                Passwords
              </Link>
              <button
                onClick={handlePasswordsLogout}
                className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout Passwords
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Step Passwords (Admin Only)
              </h2>
              <p className="text-gray-600">
                Copy passwords for case study steps
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Authenticated</span>
            </div>
          </div>

          {/* Passwords List */}
          <div className="space-y-6">
            {caseStudyData.map((caseStudy, csIndex) => (
              <div key={caseStudy.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Case Study {csIndex + 1}: {caseStudy.title}
                </h3>
                
                <div className="space-y-3">
                  {caseStudy.steps.map((step, stepIndex) => (
                    <div
                      key={step.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          Step {stepIndex + 1}: {step.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Password: <span className="font-mono text-purple-600">{step.password}</span>
                        </p>
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(step.password, step.id)}
                        className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                      >
                        {copiedPassword === step.id ? (
                          <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClipboardPage() {
  return (
    <ProtectedRoute>
      <ClipboardContent />
    </ProtectedRoute>
  );
}
