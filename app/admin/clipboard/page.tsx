'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ClipboardEntry {
  id: string;
  caseStudyName: string;
  stepName: string;
  password: string;
}

export default function AdminClipboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [entries, setEntries] = useState<ClipboardEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Form state
  const [newEntry, setNewEntry] = useState({
    caseStudyName: '',
    stepName: '',
    password: ''
  });

  // Hash function for passcode validation
  const hashPasscode = (passcode: string): string => {
    let hash = 0;
    for (let i = 0; i < passcode.length; i++) {
      const char = passcode.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  };

  // Hashed passcode for "workshop34" = 8090152
  const VALID_PASSCODE_HASH = '8090152';

  useEffect(() => {
    // Load entries from localStorage
    const stored = localStorage.getItem('admin_clipboard_entries');
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  const saveEntries = (newEntries: ClipboardEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('admin_clipboard_entries', JSON.stringify(newEntries));
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

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.caseStudyName || !newEntry.stepName || !newEntry.password) {
      setError('All fields are required!');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const entry: ClipboardEntry = {
      id: Date.now().toString(),
      ...newEntry
    };

    saveEntries([...entries, entry]);
    setNewEntry({ caseStudyName: '', stepName: '', password: '' });
    setShowAddForm(false);
  };

  const handleDeleteEntry = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this entry?');
    if (confirmed) {
      saveEntries(entries.filter(e => e.id !== id));
    }
  };

  const copyToClipboard = (password: string, id: string) => {
    navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Clipboard</h2>
            <p className="text-gray-600">Enter admin passcode to manage clipboard</p>
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
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Access Clipboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/admin/dashboard" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              ← Back to Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Clipboard Manager
              </h1>
              <p className="text-sm text-gray-600">
                Manage case study passwords
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">
                Admin Dashboard
              </Link>
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Exit
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header with Add Button */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Clipboard Entries
              </h2>
              <p className="text-gray-600">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} stored
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {showAddForm ? 'Cancel' : 'Add Entry'}
            </button>
          </div>

          {/* Add Entry Form */}
          {showAddForm && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Entry</h3>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleAddEntry} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Case Study Name
                  </label>
                  <input
                    type="text"
                    value={newEntry.caseStudyName}
                    onChange={(e) => setNewEntry({ ...newEntry, caseStudyName: e.target.value })}
                    placeholder="e.g., House Price Prediction"
                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Step Name
                  </label>
                  <input
                    type="text"
                    value={newEntry.stepName}
                    onChange={(e) => setNewEntry({ ...newEntry, stepName: e.target.value })}
                    placeholder="e.g., Step 1: Import Libraries"
                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="text"
                    value={newEntry.password}
                    onChange={(e) => setNewEntry({ ...newEntry, password: e.target.value })}
                    placeholder="e.g., hP9x2Lm4"
                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Add Entry
                </button>
              </form>
            </div>
          )}

          {/* Entries List */}
          {entries.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Entries Yet</h3>
              <p className="text-gray-600 mb-4">Click "Add Entry" to create your first clipboard entry</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {entry.caseStudyName}
                      </h3>
                      <p className="text-gray-600 mb-3">{entry.stepName}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Password:</span>
                        <span className="font-mono text-purple-600 font-semibold">{entry.password}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => copyToClipboard(entry.password, entry.id)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                      >
                        {copiedId === entry.id ? (
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
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
