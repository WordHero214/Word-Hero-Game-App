# Teacher Activities Feature - Design Document

## Overview
Teachers can create timed activities/assignments for their students with custom word lists and deadlines.

---

## Feature 1: Automatic Word Sync (Online/Offline)

### Current Behavior
- Teacher adds words to Word Bank
- Words stored in Firebase
- Students load words when online

### Proposed Enhancement
**Automatic sync when teacher adds/updates words:**

1. **Real-time Updates (Online Students)**
   - Use Firebase Firestore listeners
   - Students get new words immediately
   - No page refresh needed

2. **Background Sync (Offline Students)**
   - Words cached in IndexedDB when added
   - Service Worker syncs when student comes online
   - Notification: "New words available!"

### Implementation Approach
```typescript
// In App.tsx - Add Firestore listener
useEffect(() => {
  if (!user) return;
  
  const unsubscribe = onSnapshot(
    collection(db, 'words'),
    (snapshot) => {
      const words = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWordList(words);
      cacheWordsForOffline(words); // Auto-cache for offline
    }
  );
  
  return unsubscribe;
}, [user]);
```

**Benefits:**
- ✅ Students always have latest words
- ✅ Works offline after initial sync
- ✅ No manual refresh needed
- ✅ Seamless experience

---

## Feature 2: Teacher-Created Activities/Assignments

### User Story
"As a teacher, I want to create timed spelling activities for my students so they can practice specific words within a deadline."

### Core Features

#### A. Activity Creation
**Teacher can set:**
- Activity title (e.g., "Week 5 Spelling Quiz")
- Description/instructions
- Word list (select from word bank or create custom)
- Difficulty level
- Time limit per question (optional)
- Due date/deadline
- Target students (all, specific grade, specific section, or individual students)
- Number of attempts allowed (1, 2, 3, or unlimited)

#### B. Activity Types
1. **Timed Quiz** - Fixed time per question
2. **Deadline Assignment** - Complete before due date
3. **Practice Activity** - No deadline, unlimited attempts

#### C. Student View
- See assigned activities on dashboard
- Status indicators: Not Started, In Progress, Completed, Overdue
- Time remaining until deadline
- Attempt count (e.g., "Attempt 2 of 3")
- Score history for multiple attempts

#### D. Teacher Monitoring
- Real-time completion tracking
- Student scores and attempts
- Time taken per student
- Export results to CSV/PDF

---

## Database Schema

### New Collection: `activities`
```typescript
interface Activity {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  
  // Word selection
  wordIds: string[]; // IDs of words from word bank
  customWords?: Word[]; // Optional custom words for this activity
  difficulty?: Difficulty; // Filter words by difficulty
  
  // Timing
  timePerQuestion?: number; // Seconds per question (optional)
  dueDate: Timestamp; // Deadline
  startDate: Timestamp; // When activity becomes available
  
  // Targeting
  targetType: 'all' | 'grade' | 'section' | 'students';
  targetGrades?: string[]; // e.g., ['1', '2', '3']
  targetSections?: string[]; // e.g., ['A', 'B']
  targetStudentIds?: string[]; // Specific student IDs
  
  // Settings
  maxAttempts: number; // 1, 2, 3, or -1 for unlimited
  shuffleQuestions: boolean;
  showResults: boolean; // Show correct answers after completion
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'draft' | 'active' | 'closed';
}
```

### New Collection: `activitySubmissions`
```typescript
interface ActivitySubmission {
  id: string;
  activityId: string;
  studentId: string;
  studentName: string;
  
  // Attempt info
  attemptNumber: number;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  
  // Results
  results: {
    wordId: string;
    word: string;
    isCorrect: boolean;
    timeSpent: number; // Seconds
  }[];
  
  score: number; // Percentage
  totalQuestions: number;
  correctAnswers: number;
  
  // Status
  status: 'in_progress' | 'completed' | 'abandoned';
  
  // Offline support
  submittedOffline: boolean;
  syncedAt?: Timestamp;
}
```

---

## UI Components

### 1. Teacher Dashboard - Activities Tab
```
┌─────────────────────────────────────────┐
│  📚 Activities                          │
│  ┌─────────────────────────────────┐   │
│  │ + Create New Activity            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Active Activities (3)                  │
│  ┌─────────────────────────────────┐   │
│  │ Week 5 Spelling Quiz             │   │
│  │ Due: Feb 20, 2026                │   │
│  │ 15/25 students completed         │   │
│  │ [View Results] [Edit] [Close]    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Upcoming Activities (2)                │
│  Past Activities (10)                   │
└─────────────────────────────────────────┘
```

### 2. Create Activity Modal
```
┌─────────────────────────────────────────┐
│  Create New Activity                    │
│                                         │
│  Title: [________________]              │
│  Description: [___________]             │
│                                         │
│  Select Words:                          │
│  ○ From Word Bank (select difficulty)   │
│  ○ Custom Word List                     │
│                                         │
│  Assign To:                             │
│  ○ All Students                         │
│  ○ Specific Grade: [1][2][3][4][5][6]  │
│  ○ Specific Section: [A][B][C][D][E]   │
│  ○ Individual Students: [Select...]     │
│                                         │
│  Settings:                              │
│  Due Date: [Feb 20, 2026]              │
│  Time per Question: [30] seconds        │
│  Max Attempts: [3]                      │
│  ☑ Shuffle Questions                    │
│  ☑ Show Results After Completion        │
│                                         │
│  [Cancel]  [Save Draft]  [Publish]     │
└─────────────────────────────────────────┘
```

### 3. Student Dashboard - Activities Section
```
┌─────────────────────────────────────────┐
│  📝 My Activities                       │
│                                         │
│  Due Soon (2)                           │
│  ┌─────────────────────────────────┐   │
│  │ ⏰ Week 5 Spelling Quiz          │   │
│  │ Due in 2 days                    │   │
│  │ Attempts: 0/3                    │   │
│  │ [Start Activity]                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Completed (5)                          │
│  ┌─────────────────────────────────┐   │
│  │ ✅ Week 4 Quiz - Score: 85%      │   │
│  │ Completed: Feb 13, 2026          │   │
│  │ [View Results]                   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Auto Word Sync (Quick Win)
**Time: 1-2 hours**

1. Add Firestore listener in App.tsx
2. Update offlineStorage to cache on word changes
3. Add notification when new words available
4. Test online/offline sync

### Phase 2: Activity System (Core Feature)
**Time: 1-2 days**

#### Step 1: Database & Types
- Add Activity and ActivitySubmission types to types.ts
- Create Firestore collections
- Update Firestore rules

#### Step 2: Teacher UI
- Create ActivityManager component
- Create ActivityForm component
- Add Activities tab to TeacherView
- Implement CRUD operations

#### Step 3: Student UI
- Add Activities section to student dashboard
- Create ActivityPlayer component (game with timer)
- Show activity status and deadlines
- Handle multiple attempts

#### Step 4: Results & Analytics
- Teacher results dashboard
- Student score history
- Export functionality
- Email notifications (optional)

### Phase 3: Offline Support for Activities
**Time: 4-6 hours**

1. Cache assigned activities in IndexedDB
2. Allow offline activity completion
3. Queue submissions for sync
4. Handle deadline validation

---

## Technical Considerations

### 1. Real-time Updates
**Use Firestore Listeners:**
```typescript
// Students listen for new activities
onSnapshot(
  query(collection(db, 'activities'), 
    where('targetStudentIds', 'array-contains', userId),
    where('status', '==', 'active')
  ),
  (snapshot) => {
    // Update activities list
  }
);
```

### 2. Deadline Enforcement
**Server-side validation:**
- Use Firestore rules to prevent late submissions
- Client-side checks for UX
- Grace period option (5-10 minutes)

### 3. Timer Implementation
**Accurate timing:**
- Use server timestamps
- Account for offline time
- Pause/resume support
- Warning at 10 seconds remaining

### 4. Offline Handling
**Strategy:**
- Download activity when assigned
- Cache words and questions
- Save progress locally
- Sync when online
- Validate deadline server-side

---

## Security & Firestore Rules

```javascript
// Activities collection
match /activities/{activityId} {
  // Teachers can create/edit their own activities
  allow create: if isSignedIn() && getUserRole() == 'TEACHER';
  allow update, delete: if isSignedIn() && 
    resource.data.teacherId == request.auth.uid;
  
  // Students can read activities assigned to them
  allow read: if isSignedIn() && (
    resource.data.targetType == 'all' ||
    request.auth.uid in resource.data.targetStudentIds
  );
}

// Activity submissions
match /activitySubmissions/{submissionId} {
  // Students can create/update their own submissions
  allow create, update: if isSignedIn() && 
    request.auth.uid == request.resource.data.studentId;
  
  // Students can read their own submissions
  // Teachers can read submissions for their activities
  allow read: if isSignedIn() && (
    request.auth.uid == resource.data.studentId ||
    getUserRole() == 'TEACHER'
  );
}
```

---

## Benefits

### For Teachers:
- ✅ Create custom assignments
- ✅ Set deadlines and time limits
- ✅ Track student progress in real-time
- ✅ Identify struggling students
- ✅ Export results for grading

### For Students:
- ✅ Clear deadlines and expectations
- ✅ Multiple attempts to improve
- ✅ Works offline
- ✅ Immediate feedback
- ✅ Track own progress

### For System:
- ✅ Structured learning path
- ✅ Better engagement
- ✅ Data-driven insights
- ✅ Scalable architecture

---

## Next Steps

1. **Review & Approve Design**
2. **Create Database Schema**
3. **Implement Phase 1** (Auto Word Sync)
4. **Implement Phase 2** (Activity System)
5. **Test with Real Teachers/Students**
6. **Iterate Based on Feedback**

---

## Questions to Consider

1. Should activities support different question types (multiple choice, fill-in-blank)?
2. Should there be activity templates for common scenarios?
3. Should students be able to see their ranking within an activity?
4. Should teachers be able to clone/reuse activities?
5. Should there be notifications (email/push) for new activities?

---

## Estimated Timeline

- **Phase 1 (Auto Sync)**: 2 hours
- **Phase 2 (Activities)**: 2 days
- **Phase 3 (Offline)**: 6 hours
- **Testing & Polish**: 1 day

**Total: 3-4 days of development**

---

This design provides a solid foundation for teacher-created activities while maintaining the offline-first approach that's critical for your use case!
