/**
 * State Context for AI Workshop Platform
 * 
 * Provides centralized state management for workshop data including:
 * - Unlocked case study steps
 * - Poll submission tracking
 * - Submitted doubts
 * 
 * All state is automatically persisted to sessionStorage and restored on mount.
 * 
 * Requirements: 5.2, 5.5, 8.3, 9.4, 11.1, 11.2, 11.3
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Doubt } from '@/types';
import {
  loadUnlockedSteps,
  saveUnlockedSteps,
  loadPollSubmissions,
  savePollSubmissions,
  loadSubmittedDoubts,
  saveSubmittedDoubts,
  isSessionStorageAvailable,
} from './sessionStorage';

// ============================================================================
// Context Types
// ============================================================================

interface WorkshopState {
  unlockedSteps: Record<string, Set<string>>;
  pollSubmissions: Record<string, boolean>;
  submittedDoubts: Doubt[];
}

interface WorkshopContextValue extends WorkshopState {
  unlockStep: (caseStudyId: string, stepId: string) => void;
  isStepUnlocked: (caseStudyId: string, stepId: string) => boolean;
  submitPollVote: (pollId: string) => void;
  hasPollBeenSubmitted: (pollId: string) => boolean;
  submitDoubt: (doubt: Omit<Doubt, 'id' | 'timestamp'>) => void;
}

// ============================================================================
// Context Creation
// ============================================================================

const WorkshopContext = createContext<WorkshopContextValue | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

interface WorkshopProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that manages workshop state and provides actions
 * Requirements: 5.2, 5.5, 8.3, 9.4, 11.1, 11.2, 11.3
 */
export function WorkshopProvider({ children }: WorkshopProviderProps) {
  // Initialize state with empty values
  const [state, setState] = useState<WorkshopState>({
    unlockedSteps: {},
    pollSubmissions: {},
    submittedDoubts: [],
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Load state from sessionStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!isSessionStorageAvailable()) {
      console.warn('sessionStorage is not available. State will not persist.');
    }

    const loadedState: WorkshopState = {
      unlockedSteps: loadUnlockedSteps(),
      pollSubmissions: loadPollSubmissions(),
      submittedDoubts: loadSubmittedDoubts(),
    };

    setState(loadedState);
    setIsInitialized(true);
  }, []);

  // Persist unlockedSteps to sessionStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    saveUnlockedSteps(state.unlockedSteps);
  }, [state.unlockedSteps, isInitialized]);

  // Persist pollSubmissions to sessionStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    savePollSubmissions(state.pollSubmissions);
  }, [state.pollSubmissions, isInitialized]);

  // Persist submittedDoubts to sessionStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    saveSubmittedDoubts(state.submittedDoubts);
  }, [state.submittedDoubts, isInitialized]);

  // ============================================================================
  // Actions
  // ============================================================================

  /**
   * Unlocks a step for a specific case study
   * Requirements: 5.2, 5.5, 11.1
   */
  const unlockStep = useCallback((caseStudyId: string, stepId: string) => {
    setState((prevState) => {
      const currentSteps = prevState.unlockedSteps[caseStudyId] || new Set<string>();
      const updatedSteps = new Set(currentSteps);
      updatedSteps.add(stepId);

      return {
        ...prevState,
        unlockedSteps: {
          ...prevState.unlockedSteps,
          [caseStudyId]: updatedSteps,
        },
      };
    });
  }, []);

  /**
   * Checks if a step is unlocked for a specific case study
   * Requirements: 5.2
   */
  const isStepUnlocked = useCallback(
    (caseStudyId: string, stepId: string): boolean => {
      const steps = state.unlockedSteps[caseStudyId];
      return steps ? steps.has(stepId) : false;
    },
    [state.unlockedSteps]
  );

  /**
   * Records that a user has voted on a poll
   * Requirements: 8.3, 11.2
   */
  const submitPollVote = useCallback((pollId: string) => {
    setState((prevState) => ({
      ...prevState,
      pollSubmissions: {
        ...prevState.pollSubmissions,
        [pollId]: true,
      },
    }));
  }, []);

  /**
   * Checks if a poll has been submitted by the user
   * Requirements: 8.3
   */
  const hasPollBeenSubmitted = useCallback(
    (pollId: string): boolean => {
      return state.pollSubmissions[pollId] === true;
    },
    [state.pollSubmissions]
  );

  /**
   * Submits a new doubt
   * Requirements: 9.4, 11.3
   */
  const submitDoubt = useCallback((doubt: Omit<Doubt, 'id' | 'timestamp'>) => {
    const newDoubt: Doubt = {
      ...doubt,
      id: `doubt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    setState((prevState) => ({
      ...prevState,
      submittedDoubts: [...prevState.submittedDoubts, newDoubt],
    }));
  }, []);

  // ============================================================================
  // Context Value
  // ============================================================================

  const contextValue: WorkshopContextValue = {
    ...state,
    unlockStep,
    isStepUnlocked,
    submitPollVote,
    hasPollBeenSubmitted,
    submitDoubt,
  };

  return (
    <WorkshopContext.Provider value={contextValue}>
      {children}
    </WorkshopContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Custom hook to access workshop state and actions
 * Requirements: 5.2, 8.3, 9.4
 * 
 * @throws Error if used outside of WorkshopProvider
 */
export function useWorkshop(): WorkshopContextValue {
  const context = useContext(WorkshopContext);
  
  if (context === undefined) {
    throw new Error('useWorkshop must be used within a WorkshopProvider');
  }
  
  return context;
}
