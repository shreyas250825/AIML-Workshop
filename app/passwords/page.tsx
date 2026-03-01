'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

interface PasswordEntry {
  id: string;
  caseStudyName: string;
  stepName: string;
  password: string;
}

function PasswordsContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAddAuthenticated, setIsAddAuthenticated] = useState(false);
  const [addPasscode, setAddPasscode] = useState('');
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletePasscode, setDeletePasscode] = useState('');
  const [deleteError, setDeleteError] = useState('');
  
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
    // Load entries from localStorage (shared with admin clipboard)
    const stored = localStorage.getItem('admin_clipboard_entries');
    if (stored) {
      setEntries(JSON.parse(stored));
    }

    // Auto-refresh entries every 2 seconds to show new additions
    const interval = setInterval(() => {
      const stored = localStorage.getItem('admin_clipboard_entries');
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const saveEntries = (newEntries: PasswordEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('admin_clipboard_entries', JSON.stringify(newEntries));
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAuthenticateAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (hashPasscode(addPasscode) === VALID_PASSCODE_HASH) {
      setIsAddAuthenticated(true);
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

    const entry: PasswordEntry = {
      id: Date.now().toString(),
      ...newEntry
    };

    saveEntries([...entries, entry]);
    setNewEntry({ caseStudyName: '', stepName: '', password: '' });
    setShowAddForm(false);
    setIsAddAuthenticated(false);
    setAddPasscode('');
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setIsAddAuthenticated(false);
    setAddPasscode('');
    setNewEntry({ caseStudyName: '', stepName: '', password: '' });
    setError('');
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeletePasscode('');
    setDeleteError('');
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
    setDeletePasscode('');
    setDeleteError('');
  };

  const handleDeleteSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (hashPasscode(deletePasscode) === VALID_PASSCODE_HASH) {
      saveEntries(entries.filter(entry => entry.id !== id));
      setDeleteId(null);
      setDeletePasscode('');
      setDeleteError('');
    } else {
      setDeleteError('Invalid passcode!');
      setTimeout(() => setDeleteError(''), 3000);
    }
  };

  const copyToClipboard = (password: string, id: string) => {
    navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
              <Link href="/passwords" className="text-purple-600 font-semibold">
                Passwords
              </Link>
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
          {/* Header with Add Button */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Step Passwords
              </h2>
              <p className="text-gray-600">
                View passwords for case study steps shared by your instructor
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {showAddForm ? 'Cancel' : 'Add Password'}
            </button>
          </div>

          {/* Add Entry Form */}
          {showAddForm && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Password Entry</h3>
              
              {!isAddAuthenticated ? (
                <div>
                  <p className="text-gray-600 mb-4">Enter passcode to add a new entry</p>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleAuthenticateAdd} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Passcode
                      </label>
                      <input
                        type="password"
                        value={addPasscode}
                        onChange={(e) => setAddPasscode(e.target.value)}
                        placeholder="Enter passcode to add entry"
                        className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition-all"
                      >
                        Verify Passcode
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelAdd}
                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
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
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all"
                      >
                        Add Entry
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelAdd}
                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Passwords List */}
          {entries.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Passwords Available</h3>
              <p className="text-gray-600">
                The instructor hasn't added any passwords yet. Check back later!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                >
                  {deleteId === entry.id ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900">Delete Entry</h3>
                      <p className="text-gray-600">Enter passcode to delete this entry</p>
                      {deleteError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                          {deleteError}
                        </div>
                      )}
                      <form onSubmit={(e) => handleDeleteSubmit(e, entry.id)}>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Passcode
                          </label>
                          <input
                            type="password"
                            value={deletePasscode}
                            onChange={(e) => setDeletePasscode(e.target.value)}
                            placeholder="Enter passcode to delete"
                            className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-300"
                            autoFocus
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all"
                          >
                            Confirm Delete
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteCancel}
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {entry.caseStudyName}
                        </h3>
                        <p className="text-gray-600 mb-3">{entry.stepName}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Password:</span>
                          <span className="font-mono text-purple-600 font-semibold text-lg">{entry.password}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => copyToClipboard(entry.password, entry.id)}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
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
                          onClick={() => handleDeleteClick(entry.id)}
                          className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PasswordsPage() {
  return (
    <ProtectedRoute>
      <PasswordsContent />
    </ProtectedRoute>
  );
}
