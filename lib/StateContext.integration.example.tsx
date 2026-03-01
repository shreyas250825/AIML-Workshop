/**
 * Integration Example for StateContext
 * 
 * This file demonstrates how to use the WorkshopProvider and useWorkshop hook
 * in a real application. It shows all the main features:
 * - Unlocking case study steps
 * - Checking step unlock status
 * - Submitting poll votes
 * - Checking poll submission status
 * - Submitting doubts
 * 
 * Requirements: 5.2, 5.5, 8.3, 9.4, 11.1, 11.2, 11.3
 */

'use client';

import React, { useState } from 'react';
import { WorkshopProvider, useWorkshop } from './StateContext';

// ============================================================================
// Example Component: Case Study Step Unlocker
// ============================================================================

function StepUnlocker() {
  const { unlockStep, isStepUnlocked } = useWorkshop();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const caseStudyId = 'case-study-1';
  const stepId = 'step-1';
  const correctPassword = 'unlock123';

  const handleUnlock = () => {
    if (password === correctPassword) {
      unlockStep(caseStudyId, stepId);
      setError('');
      setPassword('');
    } else {
      setError('Incorrect password');
    }
  };

  const isUnlocked = isStepUnlocked(caseStudyId, stepId);

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Step 1: Data Preprocessing</h3>
      
      {!isUnlocked ? (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            This step is locked. Enter the password to unlock.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="border px-2 py-1 rounded mr-2"
          />
          <button
            onClick={handleUnlock}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Unlock
          </button>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      ) : (
        <div>
          <p className="text-green-600 mb-2">✓ Step unlocked!</p>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {`import pandas as pd
import numpy as np

# Load the dataset
df = pd.read_csv('data.csv')

# Handle missing values
df.fillna(df.mean(), inplace=True)`}
          </pre>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example Component: Poll Voting
// ============================================================================

function PollVoting() {
  const { submitPollVote, hasPollBeenSubmitted } = useWorkshop();
  const [selectedOption, setSelectedOption] = useState('');

  const pollId = 'poll-1';
  const hasVoted = hasPollBeenSubmitted(pollId);

  const handleVote = () => {
    if (selectedOption) {
      submitPollVote(pollId);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Poll: What&apos;s your experience level?</h3>
      
      {!hasVoted ? (
        <div>
          <div className="space-y-2 mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="experience"
                value="beginner"
                checked={selectedOption === 'beginner'}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mr-2"
              />
              Beginner
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="experience"
                value="intermediate"
                checked={selectedOption === 'intermediate'}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mr-2"
              />
              Intermediate
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="experience"
                value="advanced"
                checked={selectedOption === 'advanced'}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mr-2"
              />
              Advanced
            </label>
          </div>
          <button
            onClick={handleVote}
            disabled={!selectedOption}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Submit Vote
          </button>
        </div>
      ) : (
        <div>
          <p className="text-green-600">✓ Thank you for voting!</p>
          <p className="text-sm text-gray-600 mt-2">
            You have already submitted your vote for this poll.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example Component: Doubt Submission
// ============================================================================

function DoubtSubmission() {
  const { submitDoubt, submittedDoubts } = useWorkshop();
  const [question, setQuestion] = useState('');
  const [caseStudyId, setCaseStudyId] = useState('case-study-1');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (question.trim()) {
      submitDoubt({
        caseStudyId,
        question: question.trim(),
        isAnonymous,
      });
      
      setQuestion('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Submit a Doubt</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Case Study
          </label>
          <select
            value={caseStudyId}
            onChange={(e) => setCaseStudyId(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="case-study-1">Case Study 1: Predictive Analytics</option>
            <option value="case-study-2">Case Study 2: NLP Classification</option>
            <option value="case-study-3">Case Study 3: Computer Vision</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Your Question
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question here..."
            className="border px-2 py-1 rounded w-full"
            rows={3}
          />
        </div>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="mr-2"
          />
          Submit anonymously
        </label>

        <button
          onClick={handleSubmit}
          disabled={!question.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Submit Doubt
        </button>

        {showSuccess && (
          <p className="text-green-600 text-sm">
            ✓ Doubt submitted successfully!
          </p>
        )}
      </div>

      {submittedDoubts.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">Your Submitted Doubts:</h4>
          <div className="space-y-2">
            {submittedDoubts.map((doubt) => (
              <div key={doubt.id} className="text-sm bg-gray-50 p-2 rounded">
                <p className="font-medium">{doubt.question}</p>
                <p className="text-gray-600 text-xs mt-1">
                  {doubt.timestamp.toLocaleString()}
                  {doubt.isAnonymous && ' • Anonymous'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Example App
// ============================================================================

function ExampleApp() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">
        Workshop State Management Example
      </h1>
      
      <p className="text-gray-600 mb-8">
        This example demonstrates the WorkshopProvider and useWorkshop hook.
        All state is automatically persisted to sessionStorage and will be
        restored when you refresh the page.
      </p>

      <StepUnlocker />
      <PollVoting />
      <DoubtSubmission />

      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h3 className="font-bold mb-2">Try it out:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Unlock the step with password: <code className="bg-white px-1">unlock123</code></li>
          <li>Vote in the poll</li>
          <li>Submit a doubt</li>
          <li>Refresh the page - your state will be preserved!</li>
          <li>Close the browser tab - state will be cleared (sessionStorage behavior)</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// Root Component with Provider
// ============================================================================

export default function StateContextExample() {
  return (
    <WorkshopProvider>
      <ExampleApp />
    </WorkshopProvider>
  );
}
