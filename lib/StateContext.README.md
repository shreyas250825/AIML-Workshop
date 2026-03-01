# StateContext - Workshop State Management

The StateContext provides centralized state management for the AI Workshop Platform. It manages unlocked case study steps, poll submissions, and submitted doubts with automatic persistence to sessionStorage.

## Features

- **Unlocked Steps Management**: Track which case study steps have been unlocked
- **Poll Submission Tracking**: Record which polls users have voted on
- **Doubt Submission**: Store and retrieve submitted questions
- **Automatic Persistence**: All state changes are automatically saved to sessionStorage
- **Session-Based**: State persists across page refreshes but clears when the browser session ends

## Requirements Fulfilled

- **5.2**: Store unlocked state in session storage
- **5.5**: Persist unlocked state across page refreshes
- **8.3**: Record poll votes
- **9.4**: Store doubts with timestamps
- **11.1**: Store unlocked steps in session storage
- **11.2**: Store poll submissions in session storage
- **11.3**: Store doubts in session storage

## Usage

### 1. Wrap Your App with WorkshopProvider

```tsx
import { WorkshopProvider } from '@/lib/StateContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WorkshopProvider>
          {children}
        </WorkshopProvider>
      </body>
    </html>
  );
}
```

### 2. Use the useWorkshop Hook

```tsx
'use client';

import { useWorkshop } from '@/lib/StateContext';

export function CaseStudyStep({ caseStudyId, stepId, password }) {
  const { unlockStep, isStepUnlocked } = useWorkshop();
  const [inputPassword, setInputPassword] = useState('');
  
  const isUnlocked = isStepUnlocked(caseStudyId, stepId);
  
  const handleUnlock = () => {
    if (inputPassword === password) {
      unlockStep(caseStudyId, stepId);
    }
  };
  
  return (
    <div>
      {isUnlocked ? (
        <CodeBlock />
      ) : (
        <PasswordInput onSubmit={handleUnlock} />
      )}
    </div>
  );
}
```

## API Reference

### WorkshopProvider

Provider component that wraps your application and provides state management.

**Props:**
- `children: React.ReactNode` - Child components

**Example:**
```tsx
<WorkshopProvider>
  <App />
</WorkshopProvider>
```

### useWorkshop Hook

Custom hook that provides access to workshop state and actions.

**Returns:** `WorkshopContextValue`

**Throws:** Error if used outside of `WorkshopProvider`

## State

### unlockedSteps
```typescript
unlockedSteps: Record<string, Set<string>>
```
Object mapping case study IDs to sets of unlocked step IDs.

### pollSubmissions
```typescript
pollSubmissions: Record<string, boolean>
```
Object mapping poll IDs to submission status (true if voted).

### submittedDoubts
```typescript
submittedDoubts: Doubt[]
```
Array of all submitted doubts with timestamps.

## Actions

### unlockStep
```typescript
unlockStep(caseStudyId: string, stepId: string): void
```
Unlocks a specific step for a case study. Automatically persists to sessionStorage.

**Example:**
```tsx
const { unlockStep } = useWorkshop();
unlockStep('case-study-1', 'step-2');
```

### isStepUnlocked
```typescript
isStepUnlocked(caseStudyId: string, stepId: string): boolean
```
Checks if a step is unlocked for a specific case study.

**Example:**
```tsx
const { isStepUnlocked } = useWorkshop();
const unlocked = isStepUnlocked('case-study-1', 'step-2');
```

### submitPollVote
```typescript
submitPollVote(pollId: string): void
```
Records that a user has voted on a poll. Automatically persists to sessionStorage.

**Example:**
```tsx
const { submitPollVote } = useWorkshop();
submitPollVote('poll-1');
```

### hasPollBeenSubmitted
```typescript
hasPollBeenSubmitted(pollId: string): boolean
```
Checks if a poll has been submitted by the user.

**Example:**
```tsx
const { hasPollBeenSubmitted } = useWorkshop();
const hasVoted = hasPollBeenSubmitted('poll-1');
```

### submitDoubt
```typescript
submitDoubt(doubt: Omit<Doubt, 'id' | 'timestamp'>): void
```
Submits a new doubt. Automatically generates an ID and timestamp. Persists to sessionStorage.

**Parameters:**
- `doubt.caseStudyId: string` - ID of the related case study
- `doubt.question: string` - The question text
- `doubt.isAnonymous: boolean` - Whether the submission is anonymous

**Example:**
```tsx
const { submitDoubt } = useWorkshop();
submitDoubt({
  caseStudyId: 'case-study-1',
  question: 'How does gradient descent work?',
  isAnonymous: false,
});
```

## Complete Example

See `StateContext.integration.example.tsx` for a complete working example that demonstrates:
- Step unlocking with password validation
- Poll voting with submission tracking
- Doubt submission with form handling
- State persistence across page refreshes

## SessionStorage Integration

The StateContext uses the sessionStorage utilities from `sessionStorage.ts`:
- `loadUnlockedSteps()` / `saveUnlockedSteps()`
- `loadPollSubmissions()` / `savePollSubmissions()`
- `loadSubmittedDoubts()` / `saveSubmittedDoubts()`

All persistence happens automatically when state changes. You don't need to manually call save functions.

## Error Handling

- If sessionStorage is unavailable, a warning is logged to the console
- State will still work in memory but won't persist
- The `useWorkshop` hook throws an error if used outside of `WorkshopProvider`

## Testing

See `StateContext.test.tsx` for comprehensive unit tests covering:
- State initialization from sessionStorage
- Step unlocking and persistence
- Poll submission tracking
- Doubt submission
- Error handling

## Notes

- State is session-based and will be cleared when the browser tab/window is closed
- State persists across page refreshes within the same session
- All Set objects are properly serialized/deserialized for sessionStorage
- Date objects in doubts are properly converted to/from ISO strings
