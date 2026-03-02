'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface PasswordEntry {
  id: string;
  caseStudyName: string;
  stepName: string;
  password: string;
}

export default function PasswordsPage() {
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Prevent double-fetch in React Strict Mode
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchData = async () => {
      try {
        console.log('Fetching passwords...');
        const res = await fetch('/api/passwords', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        const data = await res.json();
        console.log('Passwords response:', data);
        
        if (data.success && data.data && Array.isArray(data.data)) {
          const mappedEntries = data.data.map((item: any) => ({
            id: item.caseStudyName + '-' + item.stepName,
            caseStudyName: item.caseStudyName,
            stepName: item.stepName,
            password: item.password
          }));
          console.log('Mapped entries:', mappedEntries);
          setEntries(mappedEntries);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (err) {
        console.error('Error fetching passwords:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const timer = setInterval(fetchData, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (pwd: string, id: string) => {
    navigator.clipboard.writeText(pwd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Workshop Platform</h1>
              <p className="text-sm text-gray-500">Welcome, Shreyas</p>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">
                Case Studies
              </Link>
              <Link href="/leaderboard" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">
                Leaderboard
              </Link>
              <Link href="/quiz" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">
                Quiz
              </Link>
              <Link href="/doubts" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">
                Doubts
              </Link>
              <Link href="/materials" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">
                Materials
              </Link>
              <Link href="/passwords" className="text-purple-600 font-semibold text-sm">
                Passwords
              </Link>
              <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Step Passwords</h2>
          <p className="text-gray-600 text-sm">View passwords for case study steps shared by your instructor</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Passwords...</h3>
            <p className="text-gray-500 text-sm">Fetching data from Google Sheets</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Passwords Available</h3>
            <p className="text-gray-500 text-sm">The instructor hasn&apos;t added any passwords yet. Check back later!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:border-purple-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{entry.caseStudyName}</h3>
                    <p className="text-sm text-gray-600">{entry.stepName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-mono font-semibold text-gray-900">
                      {entry.password}
                    </code>
                    <button
                      onClick={() => handleCopy(entry.password, entry.id)}
                      className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                        copiedId === entry.id
                          ? 'bg-green-600 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {copiedId === entry.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {entries.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-900">
                This page automatically refreshes every 5 seconds to show the latest passwords from your instructor.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
