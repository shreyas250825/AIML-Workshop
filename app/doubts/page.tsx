'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Doubt {
  id: string;
  caseStudyId: string;
  caseStudyTitle: string;
  question: string;
  isAnonymous: boolean;
  userName: string;
  timestamp: string;
}

const caseStudies = [
  { id: 'cs-1', title: 'House Price Prediction' },
  { id: 'cs-2', title: 'Credit Risk Classification' },
  { id: 'cs-3', title: 'Early Sepsis Risk Prediction' },
  { id: 'cs-4', title: 'Stock Trend Classification' },
  { id: 'cs-5', title: 'Neural Networks for Digital Classification' },
  { id: 'cs-6', title: 'Semantic Similarity Modeling' },
  { id: 'cs-7', title: 'RAG-based AI Chatbot Development' },
];

function DoubtsContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState('');
  const [question, setQuestion] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletePasscode, setDeletePasscode] = useState('');
  const [deletingDoubtId, setDeletingDoubtId] = useState<string | null>(null);

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

  useEffect(() => {
    loadDoubts();
  }, []);

  const loadDoubts = () => {
    const saved = localStorage.getItem('workshop_doubts');
    if (saved) {
      setDoubts(JSON.parse(saved));
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleDelete = (doubtId: string) => {
    if (hashPasscode(deletePasscode) === VALID_PASSCODE_HASH) {
      const updatedDoubts = doubts.filter(d => d.id !== doubtId);
      setDoubts(updatedDoubts);
      localStorage.setItem('workshop_doubts', JSON.stringify(updatedDoubts));
      setDeletingDoubtId(null);
      setDeletePasscode('');
      setSuccess('Doubt deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Invalid passcode!');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedCaseStudy) {
      setError('Please select a case study');
      return;
    }

    if (!question.trim()) {
      setError('Please enter your question');
      return;
    }

    const caseStudy = caseStudies.find(cs => cs.id === selectedCaseStudy);
    if (!caseStudy) return;

    const newDoubt: Doubt = {
      id: `doubt-${Date.now()}`,
      caseStudyId: selectedCaseStudy,
      caseStudyTitle: caseStudy.title,
      question: question.trim(),
      isAnonymous,
      userName: isAnonymous ? 'Anonymous' : (user?.name || 'Unknown'),
      timestamp: new Date().toISOString(),
    };

    const updatedDoubts = [newDoubt, ...doubts];
    setDoubts(updatedDoubts);
    localStorage.setItem('workshop_doubts', JSON.stringify(updatedDoubts));

    // Reset form
    setSelectedCaseStudy('');
    setQuestion('');
    setIsAnonymous(false);
    setSuccess('Your question has been submitted successfully!');

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(''), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
              <Link href="/doubts" className="text-purple-600 font-semibold">
                Doubts
              </Link>
              <Link href="/materials" className="text-gray-600 hover:text-purple-600 transition-colors">
                Materials
              </Link>
              <Link href="/passwords" className="text-gray-600 hover:text-purple-600 transition-colors">
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Ask Your Doubts
            </h2>
            <p className="text-gray-600">
              Have questions about the case studies? Ask here and get help from instructors
            </p>
          </div>

          {/* Submission Form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Submit a Question</h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Case Study Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Select Case Study
                </label>
                <select
                  value={selectedCaseStudy}
                  onChange={(e) => setSelectedCaseStudy(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300"
                >
                  <option value="">Choose a case study...</option>
                  {caseStudies.map((cs) => (
                    <option key={cs.id} value={cs.id}>
                      {cs.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Input */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Question
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  placeholder="Describe your doubt or question in detail..."
                  className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 resize-none"
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
                />
                <label htmlFor="anonymous" className="ml-2 text-gray-700">
                  Submit anonymously
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Submit Question
              </button>
            </form>
          </div>

          {/* Doubts List */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Recent Questions ({doubts.length})
            </h3>

            {doubts.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-lg font-medium">No questions yet</p>
                <p className="text-gray-400 text-sm mt-1">Be the first to ask a question!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {doubts.map((doubt) => (
                  <div key={doubt.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {doubt.isAnonymous ? '?' : doubt.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{doubt.userName}</p>
                          <p className="text-sm text-gray-500">{formatDate(doubt.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          {doubt.caseStudyTitle}
                        </span>
                        <button
                          onClick={() => setDeletingDoubtId(doubt.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete doubt"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">{doubt.question}</p>
                    
                    {/* Delete Passcode Input */}
                    {deletingDoubtId === doubt.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <input
                            type="password"
                            value={deletePasscode}
                            onChange={(e) => setDeletePasscode(e.target.value)}
                            placeholder="Enter passcode to delete"
                            className="flex-1 px-3 py-2 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-300 text-sm"
                          />
                          <button
                            onClick={() => handleDelete(doubt.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-sm"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              setDeletingDoubtId(null);
                              setDeletePasscode('');
                            }}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors text-sm"
                          >
                            Cancel
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
    </div>
  );
}

export default function DoubtsPage() {
  return <DoubtsContent />;
}
