'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { caseStudyData } from '@/lib/caseStudyData';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ProtectedRoute from '@/components/ProtectedRoute';

function CaseStudyContent() {
  const params = useParams();
  const router = useRouter();
  const caseStudy = caseStudyData.find((cs) => cs.id === params.id);
  
  const [unlockedSteps, setUnlockedSteps] = useState<Set<string>>(new Set());
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Case Study Not Found
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handlePasswordSubmit = (stepId: string, correctPassword: string) => {
    const enteredPassword = passwords[stepId] || '';
    
    if (enteredPassword === correctPassword) {
      setUnlockedSteps(prev => {
        const newSet = new Set(prev);
        newSet.add(stepId);
        return newSet;
      });
      setErrors(prev => ({ ...prev, [stepId]: '' }));
      setPasswords(prev => ({ ...prev, [stepId]: '' }));
    } else {
      setErrors(prev => ({ ...prev, [stepId]: 'Incorrect password' }));
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            {caseStudy.title}
          </h1>
          <p className="text-gray-400">
            {caseStudy.description}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {caseStudy.steps.map((step, index) => {
            const isUnlocked = unlockedSteps.has(step.id);
            
            return (
              <div key={step.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                {/* Step Header */}
                <div className="bg-gray-750 px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        isUnlocked ? 'bg-green-600' : 'bg-gray-600'
                      }`}>
                        {isUnlocked ? (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-400">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="p-6">
                  {!isUnlocked ? (
                    <div className="max-w-md">
                      <p className="text-gray-400 mb-4">
                        Enter the password to unlock this step
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={passwords[step.id] || ''}
                          onChange={(e) => setPasswords(prev => ({ ...prev, [step.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handlePasswordSubmit(step.id, step.password);
                            }
                          }}
                          placeholder="Enter password"
                          className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          onClick={() => handlePasswordSubmit(step.id, step.password)}
                          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          Unlock
                        </button>
                      </div>
                      {errors[step.id] && (
                        <p className="text-red-500 text-sm mt-2">{errors[step.id]}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-green-400 text-sm font-semibold">
                          ✓ Step Unlocked
                        </span>
                        <button
                          onClick={() => copyToClipboard(step.code)}
                          className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Code
                        </button>
                      </div>
                      
                      <div className="rounded-lg overflow-hidden">
                        <SyntaxHighlighter
                          language="python"
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem'
                          }}
                        >
                          {step.code}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CaseStudyPage() {
  return (
    <ProtectedRoute>
      <CaseStudyContent />
    </ProtectedRoute>
  );
}
