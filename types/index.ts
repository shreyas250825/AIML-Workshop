/**
 * Type definitions for AI Workshop Platform
 * 
 * This file contains all core TypeScript interfaces and types used throughout
 * the application for case studies, leaderboards, polls, doubts, materials,
 * state management, and 3D scene configuration.
 */

// ============================================================================
// Case Study Types
// ============================================================================

/**
 * Represents a complete case study module with problem statement and steps
 * Requirements: 1.1, 4.1
 */
export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  whyItMatters: string;
  datasetUrl: string;
  steps: CaseStudyStep[];
}

/**
 * Represents a password-protected step within a case study
 * Requirements: 5.1
 */
export interface CaseStudyStep {
  id: string;
  title: string;
  password: string;
  codeContent: string;
  language: string;
}

// ============================================================================
// Leaderboard Types
// ============================================================================

/**
 * Represents a participant entry in the leaderboard
 * Requirements: 7.1
 */
export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  accuracy: number;
  timeTaken: number; // in minutes
}

// ============================================================================
// Poll Types
// ============================================================================

/**
 * Represents a poll with question and voting options
 * Requirements: 8.1
 */
export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}

/**
 * Represents a single voting option within a poll
 * Requirements: 8.1
 */
export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

// ============================================================================
// Doubt Types
// ============================================================================

/**
 * Represents a question submitted by a participant
 * Requirements: 9.1
 */
export interface Doubt {
  id: string;
  caseStudyId: string;
  question: string;
  isAnonymous: boolean;
  timestamp: Date;
}

// ============================================================================
// Material Types
// ============================================================================

/**
 * Represents a downloadable workshop resource
 * Requirements: 10.1
 */
export interface Material {
  id: string;
  title: string;
  type: 'dataset' | 'notebook' | 'code' | 'model';
  fileUrl: string;
  description: string;
  caseStudy?: string;
}

// ============================================================================
// State Management Types
// ============================================================================

/**
 * Tracks which steps have been unlocked for each case study
 * Requirements: 5.1, 11.1
 */
export interface UnlockedStepsState {
  [caseStudyId: string]: Set<string>; // Set of unlocked step IDs
}

/**
 * Tracks which polls the user has already voted on
 * Requirements: 8.1, 11.2
 */
export interface PollSubmissionState {
  [pollId: string]: boolean; // Has user voted
}

// ============================================================================
// 3D Scene Types
// ============================================================================

/**
 * Configuration for the 3D intro scene
 * Requirements: 1.1
 */
export interface Scene3DConfig {
  objectType: 'abstract-core' | 'sports-car';
  rotationSpeed: number;
  particleCount: number;
  lightingConfig: LightingConfig;
}

/**
 * Lighting configuration for the 3D scene
 * Requirements: 1.1
 */
export interface LightingConfig {
  ambientIntensity: number;
  pointLights: PointLight[];
}

/**
 * Configuration for a single point light in the 3D scene
 * Requirements: 1.1
 */
export interface PointLight {
  position: [number, number, number];
  color: string;
  intensity: number;
}

// ============================================================================
// Animation Types
// ============================================================================

/**
 * Configuration for page and element transitions
 * Requirements: 14.1
 */
export interface TransitionConfig {
  duration: number;
  easing: string;
  delay?: number;
}

/**
 * Tracks the current state of the intro animation
 * Requirements: 1.1, 2.1
 */
export interface IntroAnimationState {
  isPlaying: boolean;
  currentPhase: 'loading' | 'labels' | 'complete';
  elapsedTime: number;
}
