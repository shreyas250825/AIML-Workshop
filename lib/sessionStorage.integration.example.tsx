/**
 * Integration example showing how sessionStorage utilities
 * will be used with React Context (Task 3.2)
 * 
 * This file demonstrates the expected usage pattern for the
 * state management context that will be implemented next.
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  saveUnlockedSteps,
  loadUnlockedSteps,
  savePollSubmissions,
  loadPollSubmissions,
  saveSubmittedDoubts,
  loadSubmittedDoubts,
  isSessionStorageAvailable,
} from './sessionStorage';
import { Doubt } from '@/types';

// ============================================================================
// Context Type Definition (Preview for Task 3.2)
// ============================================================================

interface WorkshopState {
  unlockedSteps: Record<string, Set<string>>;
  pollSubmissions: Record<string, boolean>;
  submittedDoubts: Doubt[];
  storageAvailable: boolean;
}

interface WorkshopActions {
  unlockStep: (caseStudyId: string, stepId: string) => void;
  submitPollVote: (pollId: string) => void;
  submitDoubt: (doubt: Doubt) => void;
}

type WorkshopContextType = WorkshopState & WorkshopActions;

// ============================================================================
// Example Context Implementation (Preview)
// ============================================================================

const WorkshopContext = createContext<WorkshopContextType | undefined>(undefined);

export function WorkshopProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from sessionStorage
  const [unlockedSteps, setUnlockedSteps] = useState<Record<string, Set<string>>>({});
  const [pollSubmissions, setPollSubmissions] = useState<Record<string, boolean>>({});
  const [submittedDoubts, setSubmittedDoubts] = useState<Doubt[]>([]);
  const [storageAvailable] = useState(isSessionStorageAvailable());

  // Load initial state from sessionStorage on mount
  useEffect(() => {
    if (storageAvailable) {
      setUnlockedSteps(loadUnlockedSteps());
      setPollSubmissions(loadPollSubmissions());
      setSubmittedDoubts(loadSubmittedDoubts());
    } else {
      console.warn('Session storage is not available. State will not persist across page refreshes.');
    }
  }, [storageAvailable]);

  // Action: Unlock a step
  const unlockStep = (caseStudyId: string, stepId: string) => {
    setUnlockedSteps((prev) => {
      const updated = { ...prev };
      if (!updated[caseStudyId]) {
        updated[caseStudyId] = new Set();
      }
      updated[caseStudyId].add(stepId);
      
      // Persist to sessionStorage
      saveUnlockedSteps(updated);
      
      return updated;
    });
  };

  // Action: Submit a poll vote
  const submitPollVote = (pollId: string) => {
    setPollSubmissions((prev) => {
      const updated = { ...prev, [pollId]: true };
      
      // Persist to sessionStorage
      savePollSubmissions(updated);
      
      return updated;
    });
  };

  // Action: Submit a doubt
  const submitDoubt = (doubt: Doubt) => {
    setSubmittedDoubts((prev) => {
      const updated = [...prev, doubt];
      
      // Persist to sessionStorage
      saveSubmittedDoubts(updated);
      
      return updated;
    });
  };

  const value: WorkshopContextType = {
    unlockedSteps,
    pollSubmissions,
    submittedDoubts,
    storageAvailable,
    unlockStep,
    submitPollVote,
    submitDoubt,
  };

  return (
    <WorkshopContext.Provider value={value}>
      {children}
    </WorkshopContext.Provider>
  );
}

// ============================================================================
// Hook to use the context
// ============================================================================

export function useWorkshop() {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error('useWorkshop must be used within a WorkshopProvider');
  }
  return context;
}

// ============================================================================
// Example Component Usage
// ============================================================================

/**
 * Example: Case Study Step Component
 */
export function ExampleStepComponent({ caseStudyId, stepId }: { caseStudyId: string; stepId: string }) {
  const { unlockedSteps, unlockStep } = useWorkshop();
  
  const isUnlocked = unlockedSteps[caseStudyId]?.has(stepId) ?? false;

  const handleUnlock = (password: string) => {
    // Validate password (mock validation)
    if (password === 'correct-password') {
      unlockStep(caseStudyId, stepId);
    }
  };

  return (
    <div>
      {isUnlocked ? (
        <div>Step is unlocked! Show code here...</div>
      ) : (
        <input
          type="password"
          placeholder="Enter password"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleUnlock(e.currentTarget.value);
            }
          }}
        />
      )}
    </div>
  );
}

/**
 * Example: Poll Component
 */
export function ExamplePollComponent({ pollId }: { pollId: string }) {
  const { pollSubmissions, submitPollVote } = useWorkshop();
  
  const hasVoted = pollSubmissions[pollId] ?? false;

  const handleVote = (optionId: string) => {
    // Submit vote to backend or update local state
    console.log(`Voted for option ${optionId} on poll ${pollId}`);
    submitPollVote(pollId);
  };

  return (
    <div>
      {hasVoted ? (
        <div>Thank you for voting! Here are the results...</div>
      ) : (
        <button onClick={() => handleVote('option-1')}>Vote for Option 1</button>
      )}
    </div>
  );
}

/**
 * Example: Doubt Submission Component
 */
export function ExampleDoubtComponent({ caseStudyId }: { caseStudyId: string }) {
  const { submittedDoubts, submitDoubt } = useWorkshop();
  const [question, setQuestion] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = () => {
    const doubt: Doubt = {
      id: `doubt-${Date.now()}`,
      caseStudyId,
      question,
      isAnonymous,
      timestamp: new Date(),
    };
    
    submitDoubt(doubt);
    setQuestion('');
  };

  return (
    <div>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question..."
      />
      <label>
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
        />
        Submit anonymously
      </label>
      <button onClick={handleSubmit}>Submit Doubt</button>
      
      <div>
        <h3>Your submitted doubts:</h3>
        {submittedDoubts
          .filter((d) => d.caseStudyId === caseStudyId)
          .map((doubt) => (
            <div key={doubt.id}>
              <p>{doubt.question}</p>
              <small>{doubt.timestamp.toLocaleString()}</small>
            </div>
          ))}
      </div>
    </div>
  );
}
