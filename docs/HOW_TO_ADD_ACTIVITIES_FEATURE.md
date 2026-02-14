# How to Add Activities Feature - Complete Implementation Guide

## Current Status
✅ Database types defined (Activity, ActivitySubmission)
✅ Firestore security rules updated
✅ Real-time word sync working

❌ UI components not yet built
❌ Firebase service functions not yet created

---

## What Needs to Be Built

To enable teachers to create activities, we need to implement:

1. **Firebase Service Functions** - Backend operations
2. **Activity Manager Component** - Teacher's activity dashboard
3. **Activity Form Component** - Create/edit activities
4. **Student Activity View** - Show assigned activities
5. **Activity Player** - Complete activities
6. **Results Dashboard** - View submissions

---

## Implementation Steps

### Step 1: Add Firebase Service Functions (30 minutes)

Add these functions to `firebaseService.ts`:

```typescript
// Activity CRUD Operations
export const createActivity = async (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const activityRef = doc(collection(db, 'activities'));
  await setDoc(activityRef, {
    ...activity,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return activityRef.id;
};

export const getActivitiesByTeacher = async (teacherId: string): Promise<Activity[]> => {
  const q = query(
    collection(db, 'activities'),
    where('teacherId', '==', teacherId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
};

export const getActivitiesForStudent = async (studentId: string, gradeLevel?: string, section?: string): Promise<Activity[]> => {
  // Get activities where student is targeted
  const queries = [
    query(collection(db, 'activities'), where('targetType', '==', 'all'), where('status', '==', 'active')),
    query(collection(db, 'activities'), where('targetStudentIds', 'array-contains', studentId), where('status', '==', 'active'))
  ];
  
  if (gradeLevel) {
    queries.push(
      query(collection(db, 'activities'), where('targetGrades', 'array-contains', gradeLevel), where('status', '==', 'active'))
    );
  }
  
  if (section) {
    queries.push(
      query(collection(db, 'activities'), where('targetSections', 'array-contains', section), where('status', '==', 'active'))
    );
  }
  
  const results = await Promise.all(queries.map(q => getDocs(q)));
  const activities = results.flatMap(snapshot => 
    snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity))
  );
  
  // Remove duplicates
  const uniqueActivities = Array.from(new Map(activities.map(a => [a.id, a])).values());
  return uniqueActivities;
};

export const updateActivity = async (activityId: string, updates: Partial<Activity>): Promise<void> => {
  await updateDoc(doc(db, 'activities', activityId), {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

export const deleteActivity = async (activityId: string): Promise<void> => {
  await updateDoc(doc(db, 'activities', activityId), {
    status: 'closed',
    updatedAt: Timestamp.now()
  });
};

// Activity Submission Operations
export const submitActivityAttempt = async (submission: Omit<ActivitySubmission, 'id'>): Promise<string> => {
  const submissionRef = doc(collection(db, 'activitySubmissions'));
  await setDoc(submissionRef, {
    ...submission,
    submittedOffline: !navigator.onLine,
    syncedAt: navigator.onLine ? Timestamp.now() : null
  });
  return submissionRef.id;
};

export const getActivitySubmissions = async (activityId: string): Promise<ActivitySubmission[]> => {
  const q = query(
    collection(db, 'activitySubmissions'),
    where('activityId', '==', activityId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivitySubmission));
};

export const getStudentSubmissions = async (studentId: string, activityId: string): Promise<ActivitySubmission[]> => {
  const q = query(
    collection(db, 'activitySubmissions'),
    where('studentId', '==', studentId),
    where('activityId', '==', activityId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivitySubmission));
};
```

### Step 2: Create Activity Manager Component (1 hour)

Create `masteringword-main/ActivityManager.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { Activity, User } from './types';
import { getActivitiesByTeacher, deleteActivity } from './firebaseService';

interface ActivityManagerProps {
  teacher: User;
  onCreateActivity: () => void;
  onEditActivity: (activity: Activity) => void;
}

const ActivityManager: React.FC<ActivityManagerProps> = ({ teacher, onCreateActivity, onEditActivity }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'closed'>('all');

  useEffect(() => {
    loadActivities();
  }, [teacher.id]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await getActivitiesByTeacher(teacher.id);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (activityId: string) => {
    if (confirm('Are you sure you want to close this activity?')) {
      await deleteActivity(activityId);
      loadActivities();
    }
  };

  const filteredActivities = activities.filter(a => 
    filter === 'all' || a.status === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Activities</h2>
        <button
          onClick={onCreateActivity}
          className="bg-[#00c2a0] hover:bg-[#00d8b3] px-6 py-3 rounded-xl text-white font-bold transition-all"
        >
          + Create Activity
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'active', 'draft', 'closed'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              filter === status
                ? 'bg-[#00c2a0] text-white'
                : 'bg-[#162031] text-gray-400 hover:text-white'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Activities List */}
      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading activities...</div>
      ) : filteredActivities.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          No {filter !== 'all' ? filter : ''} activities yet
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map(activity => (
            <div
              key={activity.id}
              className="bg-[#162031] rounded-2xl p-6 hover:bg-[#1a2638] transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{activity.title}</h3>
                  <p className="text-gray-400 text-sm">{activity.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activity.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  activity.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {activity.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-500">Due Date:</span>
                  <p className="text-white font-bold">
                    {new Date(activity.dueDate.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Words:</span>
                  <p className="text-white font-bold">{activity.wordIds.length}</p>
                </div>
                <div>
                  <span className="text-gray-500">Max Attempts:</span>
                  <p className="text-white font-bold">
                    {activity.maxAttempts === -1 ? 'Unlimited' : activity.maxAttempts}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEditActivity(activity)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 py-2 rounded-lg text-white font-bold text-sm transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded-lg text-white font-bold text-sm transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityManager;
```

### Step 3: Add Activities Tab to TeacherView

Update `TeacherView.tsx` to include an Activities tab:

```typescript
// Add to imports
import ActivityManager from './ActivityManager';

// Add state
const [showActivityManager, setShowActivityManager] = useState(false);

// Add tab in the navigation
<button onClick={() => setShowActivityManager(true)}>
  📝 Activities
</button>

// Add conditional rendering
{showActivityManager && (
  <ActivityManager
    teacher={user}
    onCreateActivity={() => {/* Open activity form */}}
    onEditActivity={(activity) => {/* Open edit form */}}
  />
)}
```

---

## Quick Start Option

If you want to implement this feature quickly, I can:

1. **Create all the Firebase service functions** (15 min)
2. **Create a basic Activity Manager component** (30 min)
3. **Create a simple Activity Form** (30 min)
4. **Integrate into TeacherView** (15 min)

**Total time: ~1.5 hours**

This would give teachers the ability to:
- Create activities with title, description, and word selection
- Set due dates and time limits
- Assign to all students or specific grades/sections
- View all their activities
- Edit and close activities

---

## Alternative: Minimal MVP

For the fastest implementation, I can create a minimal version that allows:

1. Teacher creates activity with:
   - Title
   - Due date
   - Select words from word bank
   - Assign to all students

2. Students see assigned activities on dashboard
3. Students complete activities (like regular game)
4. Teacher sees completion status

**This MVP would take ~45 minutes to implement.**

---

## What Would You Like?

**Option A**: Full feature with all bells and whistles (1.5-2 hours)
**Option B**: Minimal MVP to get started quickly (45 min)
**Option C**: Just the Firebase functions first, then UI later

Let me know which approach you prefer and I'll implement it!
