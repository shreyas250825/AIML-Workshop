/**
 * Example usage and manual testing for sessionStorage utilities
 * 
 * This file demonstrates how to use the session storage utilities
 * and can be used for manual testing in the browser console.
 * 
 * To test manually:
 * 1. Open browser console
 * 2. Import and run these functions
 * 3. Verify data persists across page refreshes
 * 4. Close browser tab and verify data is cleared
 */

import {
  saveUnlockedSteps,
  loadUnlockedSteps,
  savePollSubmissions,
  loadPollSubmissions,
  saveSubmittedDoubts,
  loadSubmittedDoubts,
  clearAllWorkshopData,
  isSessionStorageAvailable,
} from './sessionStorage';
import { Doubt } from '@/types';

// ============================================================================
// Example Usage
// ============================================================================

export function exampleUsage() {
  console.log('=== Session Storage Utilities Example ===\n');

  // Check if storage is available
  console.log('1. Checking storage availability...');
  const isAvailable = isSessionStorageAvailable();
  console.log(`   Storage available: ${isAvailable}\n`);

  if (!isAvailable) {
    console.error('   Cannot proceed: sessionStorage is not available');
    return;
  }

  // Example 1: Unlocked Steps
  console.log('2. Testing unlocked steps...');
  const unlockedSteps = {
    'case-study-1': new Set(['step-1', 'step-2']),
    'case-study-2': new Set(['step-1']),
  };
  saveUnlockedSteps(unlockedSteps);
  console.log('   Saved:', unlockedSteps);
  
  const loadedSteps = loadUnlockedSteps();
  console.log('   Loaded:', loadedSteps);
  console.log('   Match:', JSON.stringify(unlockedSteps) === JSON.stringify(loadedSteps) ? '✓' : '✗');
  console.log();

  // Example 2: Poll Submissions
  console.log('3. Testing poll submissions...');
  const pollSubmissions = {
    'poll-1': true,
    'poll-2': false,
    'poll-3': true,
  };
  savePollSubmissions(pollSubmissions);
  console.log('   Saved:', pollSubmissions);
  
  const loadedPolls = loadPollSubmissions();
  console.log('   Loaded:', loadedPolls);
  console.log('   Match:', JSON.stringify(pollSubmissions) === JSON.stringify(loadedPolls) ? '✓' : '✗');
  console.log();

  // Example 3: Submitted Doubts
  console.log('4. Testing submitted doubts...');
  const doubts: Doubt[] = [
    {
      id: 'doubt-1',
      caseStudyId: 'case-study-1',
      question: 'How does gradient descent work?',
      isAnonymous: false,
      timestamp: new Date('2024-01-15T10:30:00'),
    },
    {
      id: 'doubt-2',
      caseStudyId: 'case-study-2',
      question: 'What is overfitting?',
      isAnonymous: true,
      timestamp: new Date('2024-01-15T11:45:00'),
    },
  ];
  saveSubmittedDoubts(doubts);
  console.log('   Saved:', doubts);
  
  const loadedDoubts = loadSubmittedDoubts();
  console.log('   Loaded:', loadedDoubts);
  console.log('   Match:', doubts.length === loadedDoubts.length ? '✓' : '✗');
  console.log();

  // Example 4: Clear all data
  console.log('5. Testing clear all data...');
  clearAllWorkshopData();
  console.log('   Cleared all workshop data');
  
  const emptySteps = loadUnlockedSteps();
  const emptyPolls = loadPollSubmissions();
  const emptyDoubts = loadSubmittedDoubts();
  console.log('   Empty steps:', Object.keys(emptySteps).length === 0 ? '✓' : '✗');
  console.log('   Empty polls:', Object.keys(emptyPolls).length === 0 ? '✓' : '✗');
  console.log('   Empty doubts:', emptyDoubts.length === 0 ? '✓' : '✗');
  console.log();

  console.log('=== All tests completed ===');
}

// ============================================================================
// Manual Test Scenarios
// ============================================================================

/**
 * Test scenario: Unlocking steps progressively
 */
export function testProgressiveUnlocking() {
  console.log('Testing progressive step unlocking...');
  
  // Start with empty state
  clearAllWorkshopData();
  
  // Unlock first step
  let steps = loadUnlockedSteps();
  if (!steps['case-study-1']) {
    steps['case-study-1'] = new Set();
  }
  steps['case-study-1'].add('step-1');
  saveUnlockedSteps(steps);
  console.log('Unlocked step-1:', loadUnlockedSteps());
  
  // Unlock second step
  steps = loadUnlockedSteps();
  steps['case-study-1'].add('step-2');
  saveUnlockedSteps(steps);
  console.log('Unlocked step-2:', loadUnlockedSteps());
  
  // Unlock step in different case study
  steps = loadUnlockedSteps();
  steps['case-study-2'] = new Set(['step-1']);
  saveUnlockedSteps(steps);
  console.log('Unlocked case-study-2 step-1:', loadUnlockedSteps());
}

/**
 * Test scenario: Voting on polls
 */
export function testPollVoting() {
  console.log('Testing poll voting...');
  
  // Start with empty state
  clearAllWorkshopData();
  
  // Vote on first poll
  let polls = loadPollSubmissions();
  polls['poll-1'] = true;
  savePollSubmissions(polls);
  console.log('Voted on poll-1:', loadPollSubmissions());
  
  // Vote on more polls
  polls = loadPollSubmissions();
  polls['poll-2'] = true;
  polls['poll-3'] = true;
  savePollSubmissions(polls);
  console.log('Voted on multiple polls:', loadPollSubmissions());
  
  // Check if already voted
  polls = loadPollSubmissions();
  console.log('Has voted on poll-1?', polls['poll-1'] === true);
  console.log('Has voted on poll-4?', polls['poll-4'] === true);
}

/**
 * Test scenario: Submitting doubts
 */
export function testDoubtSubmission() {
  console.log('Testing doubt submission...');
  
  // Start with empty state
  clearAllWorkshopData();
  
  // Submit first doubt
  let doubts = loadSubmittedDoubts();
  doubts.push({
    id: `doubt-${Date.now()}`,
    caseStudyId: 'case-study-1',
    question: 'What is the learning rate?',
    isAnonymous: false,
    timestamp: new Date(),
  });
  saveSubmittedDoubts(doubts);
  console.log('Submitted 1 doubt:', loadSubmittedDoubts());
  
  // Submit more doubts
  doubts = loadSubmittedDoubts();
  doubts.push({
    id: `doubt-${Date.now()}`,
    caseStudyId: 'case-study-2',
    question: 'How to prevent overfitting?',
    isAnonymous: true,
    timestamp: new Date(),
  });
  saveSubmittedDoubts(doubts);
  console.log('Submitted 2 doubts:', loadSubmittedDoubts());
}

/**
 * Test scenario: Error handling when storage is unavailable
 */
export function testErrorHandling() {
  console.log('Testing error handling...');
  
  // This will log warnings if storage is unavailable
  // In a real scenario, you might mock sessionStorage to throw errors
  
  const steps = loadUnlockedSteps();
  console.log('Loaded steps (should handle errors gracefully):', steps);
  
  const polls = loadPollSubmissions();
  console.log('Loaded polls (should handle errors gracefully):', polls);
  
  const doubts = loadSubmittedDoubts();
  console.log('Loaded doubts (should handle errors gracefully):', doubts);
}
