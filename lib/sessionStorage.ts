/**
 * Session Storage Utilities for AI Workshop Platform
 * 
 * Provides functions to persist and retrieve workshop state data using
 * browser sessionStorage. Includes error handling for unavailable storage.
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 15.3
 */

import { Doubt } from '@/types';

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEYS = {
  UNLOCKED_STEPS: 'workshop_unlocked_steps',
  POLL_SUBMISSIONS: 'workshop_poll_submissions',
  SUBMITTED_DOUBTS: 'workshop_submitted_doubts',
} as const;

// ============================================================================
// Storage Availability Check
// ============================================================================

/**
 * Checks if sessionStorage is available in the current environment
 * Requirements: 15.3
 * 
 * @returns true if sessionStorage is available, false otherwise
 */
export function isSessionStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    sessionStorage.setItem(testKey, 'test');
    sessionStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('sessionStorage is not available:', error);
    return false;
  }
}

// ============================================================================
// Unlocked Steps Functions
// ============================================================================

/**
 * Saves unlocked steps state to sessionStorage
 * Requirements: 11.1, 11.4
 * 
 * @param unlockedSteps - Object mapping case study IDs to sets of unlocked step IDs
 */
export function saveUnlockedSteps(unlockedSteps: Record<string, Set<string>>): void {
  if (!isSessionStorageAvailable()) {
    console.error('Cannot save unlocked steps: sessionStorage unavailable');
    return;
  }

  try {
    // Convert Sets to arrays for JSON serialization
    const serializable: Record<string, string[]> = {};
    for (const [caseStudyId, stepIds] of Object.entries(unlockedSteps)) {
      serializable[caseStudyId] = Array.from(stepIds);
    }

    sessionStorage.setItem(STORAGE_KEYS.UNLOCKED_STEPS, JSON.stringify(serializable));
  } catch (error) {
    console.error('Failed to save unlocked steps:', error);
  }
}

/**
 * Loads unlocked steps state from sessionStorage
 * Requirements: 11.1, 11.4
 * 
 * @returns Object mapping case study IDs to sets of unlocked step IDs
 */
export function loadUnlockedSteps(): Record<string, Set<string>> {
  if (!isSessionStorageAvailable()) {
    console.error('Cannot load unlocked steps: sessionStorage unavailable');
    return {};
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEYS.UNLOCKED_STEPS);
    if (!stored) {
      return {};
    }

    const parsed: Record<string, string[]> = JSON.parse(stored);
    
    // Convert arrays back to Sets
    const result: Record<string, Set<string>> = {};
    for (const [caseStudyId, stepIds] of Object.entries(parsed)) {
      result[caseStudyId] = new Set(stepIds);
    }

    return result;
  } catch (error) {
    console.error('Failed to load unlocked steps:', error);
    return {};
  }
}

// ============================================================================
// Poll Submissions Functions
// ============================================================================

/**
 * Saves poll submission state to sessionStorage
 * Requirements: 11.2, 11.5
 * 
 * @param pollSubmissions - Object mapping poll IDs to submission status
 */
export function savePollSubmissions(pollSubmissions: Record<string, boolean>): void {
  if (!isSessionStorageAvailable()) {
    console.error('Cannot save poll submissions: sessionStorage unavailable');
    return;
  }

  try {
    sessionStorage.setItem(STORAGE_KEYS.POLL_SUBMISSIONS, JSON.stringify(pollSubmissions));
  } catch (error) {
    console.error('Failed to save poll submissions:', error);
  }
}

/**
 * Loads poll submission state from sessionStorage
 * Requirements: 11.2, 11.5
 * 
 * @returns Object mapping poll IDs to submission status
 */
export function loadPollSubmissions(): Record<string, boolean> {
  if (!isSessionStorageAvailable()) {
    console.error('Cannot load poll submissions: sessionStorage unavailable');
    return {};
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEYS.POLL_SUBMISSIONS);
    if (!stored) {
      return {};
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load poll submissions:', error);
    return {};
  }
}

// ============================================================================
// Submitted Doubts Functions
// ============================================================================

/**
 * Saves submitted doubts to sessionStorage
 * Requirements: 11.3
 * 
 * @param doubts - Array of submitted doubt objects
 */
export function saveSubmittedDoubts(doubts: Doubt[]): void {
  if (!isSessionStorageAvailable()) {
    console.error('Cannot save submitted doubts: sessionStorage unavailable');
    return;
  }

  try {
    // Convert Date objects to ISO strings for serialization
    const serializable = doubts.map(doubt => ({
      ...doubt,
      timestamp: doubt.timestamp.toISOString(),
    }));

    sessionStorage.setItem(STORAGE_KEYS.SUBMITTED_DOUBTS, JSON.stringify(serializable));
  } catch (error) {
    console.error('Failed to save submitted doubts:', error);
  }
}

/**
 * Loads submitted doubts from sessionStorage
 * Requirements: 11.3
 * 
 * @returns Array of submitted doubt objects
 */
export function loadSubmittedDoubts(): Doubt[] {
  if (!isSessionStorageAvailable()) {
    console.error('Cannot load submitted doubts: sessionStorage unavailable');
    return [];
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEYS.SUBMITTED_DOUBTS);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    
    // Convert ISO strings back to Date objects
    return parsed.map((doubt: { id: string; caseStudyId: string; question: string; isAnonymous: boolean; timestamp: string }) => ({
      ...doubt,
      timestamp: new Date(doubt.timestamp),
    }));
  } catch (error) {
    console.error('Failed to load submitted doubts:', error);
    return [];
  }
}

// ============================================================================
// Clear All Storage
// ============================================================================

/**
 * Clears all workshop-related data from sessionStorage
 * Requirements: 11.6
 * 
 * Useful for testing or when the user wants to reset their session
 */
export function clearAllWorkshopData(): void {
  if (!isSessionStorageAvailable()) {
    console.error('Cannot clear workshop data: sessionStorage unavailable');
    return;
  }

  try {
    sessionStorage.removeItem(STORAGE_KEYS.UNLOCKED_STEPS);
    sessionStorage.removeItem(STORAGE_KEYS.POLL_SUBMISSIONS);
    sessionStorage.removeItem(STORAGE_KEYS.SUBMITTED_DOUBTS);
  } catch (error) {
    console.error('Failed to clear workshop data:', error);
  }
}
