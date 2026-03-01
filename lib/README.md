# Workshop Library Utilities

This directory contains utility functions and helpers for the AI Workshop Platform.

## Session Storage Utilities

The `sessionStorage.ts` module provides functions to persist workshop state data across page navigation during a browser session.

### Features

- **Unlocked Steps Management**: Save and load which case study steps have been unlocked
- **Poll Submissions Tracking**: Track which polls the user has voted on
- **Doubts Storage**: Store submitted questions and doubts
- **Error Handling**: Graceful handling when sessionStorage is unavailable
- **Type Safety**: Full TypeScript support with proper type definitions

### Usage

#### Check Storage Availability

```typescript
import { isSessionStorageAvailable } from '@/lib/sessionStorage';

if (isSessionStorageAvailable()) {
  // Safe to use storage functions
}
```

#### Unlocked Steps

```typescript
import { saveUnlockedSteps, loadUnlockedSteps } from '@/lib/sessionStorage';

// Save unlocked steps
const unlockedSteps = {
  'case-study-1': new Set(['step-1', 'step-2']),
  'case-study-2': new Set(['step-1']),
};
saveUnlockedSteps(unlockedSteps);

// Load unlocked steps
const steps = loadUnlockedSteps();
// Returns: { 'case-study-1': Set(['step-1', 'step-2']), ... }
```

#### Poll Submissions

```typescript
import { savePollSubmissions, loadPollSubmissions } from '@/lib/sessionStorage';

// Save poll submissions
const pollSubmissions = {
  'poll-1': true,
  'poll-2': false,
};
savePollSubmissions(pollSubmissions);

// Load poll submissions
const polls = loadPollSubmissions();
// Returns: { 'poll-1': true, 'poll-2': false }
```

#### Submitted Doubts

```typescript
import { saveSubmittedDoubts, loadSubmittedDoubts } from '@/lib/sessionStorage';
import { Doubt } from '@/types';

// Save doubts
const doubts: Doubt[] = [
  {
    id: 'doubt-1',
    caseStudyId: 'case-study-1',
    question: 'How does gradient descent work?',
    isAnonymous: false,
    timestamp: new Date(),
  },
];
saveSubmittedDoubts(doubts);

// Load doubts
const loadedDoubts = loadSubmittedDoubts();
// Returns: Doubt[]
```

#### Clear All Data

```typescript
import { clearAllWorkshopData } from '@/lib/sessionStorage';

// Clear all workshop-related data from sessionStorage
clearAllWorkshopData();
```

### Error Handling

All functions include error handling for scenarios where sessionStorage is unavailable:

- **Private browsing mode**: Some browsers disable sessionStorage in private mode
- **Storage quota exceeded**: When storage limit is reached
- **Browser restrictions**: When storage is disabled by browser settings

When errors occur:
- Functions log warnings/errors to the console
- Save functions fail silently (no data is saved)
- Load functions return empty/default values (empty objects or arrays)

### Data Persistence

- **Session Duration**: Data persists across page refreshes during the same browser session
- **Session End**: Data is automatically cleared when the browser tab/window is closed
- **Multiple Tabs**: Each tab has its own session storage (data is not shared between tabs)

### Requirements Mapping

This module satisfies the following requirements:

- **11.1**: Store unlocked steps in session storage
- **11.2**: Store poll submission states in session storage
- **11.3**: Store submitted doubts in session storage
- **11.4**: Restore unlocked steps from session storage on page refresh
- **11.5**: Restore poll submission states from session storage on page refresh
- **15.3**: Display warning when session storage is unavailable

### Testing

See `sessionStorage.test.example.ts` for example usage and manual testing scenarios.

To test manually in the browser console:

```javascript
import { exampleUsage } from '@/lib/sessionStorage.test.example';
exampleUsage();
```

### Implementation Notes

- **Set Serialization**: JavaScript Sets are converted to arrays for JSON serialization
- **Date Serialization**: Date objects are converted to ISO strings for storage
- **Type Safety**: All functions use proper TypeScript types from `@/types`
- **Storage Keys**: All keys are prefixed with `workshop_` to avoid conflicts
