# Testing Guide for New Features

## Quick Test Checklist

### 1. Daily Streak System 🔥

**Test Scenario 1: First Time User**
- [ ] Create new student account
- [ ] Play one game
- [ ] Check dashboard shows "1 Day Streak"
- [ ] Verify `currentStreak: 1` in Firestore

**Test Scenario 2: Consecutive Days**
- [ ] Play game today
- [ ] Manually update `lastPlayedDate` in Firestore to yesterday's date
- [ ] Play another game
- [ ] Verify streak increments to 2
- [ ] Check for 2x sparkies bonus at 3+ days

**Test Scenario 3: Broken Streak**
- [ ] Set `lastPlayedDate` to 3 days ago
- [ ] Play a game
- [ ] Verify streak resets to 1
- [ ] Check dashboard shows orange/red banner

**Test Scenario 4: Same Day Multiple Games**
- [ ] Play first game today
- [ ] Note current streak
- [ ] Play second game today
- [ ] Verify streak doesn't increment again

**Expected Behavior:**
- Streak increments only once per day
- 3+ day streak = 2x sparkies bonus
- Dashboard banner changes color based on play status
- Longest streak tracks maximum ever achieved

---

### 2. Progress Dashboard 📊

**Test Scenario 1: New User**
- [ ] Create new account
- [ ] Open Stats tab
- [ ] Verify shows empty/zero charts
- [ ] All-time stats show 0

**Test Scenario 2: After Playing**
- [ ] Play 2-3 games
- [ ] Open Stats tab
- [ ] Verify today's bar shows data
- [ ] Weekly summary cards update
- [ ] All-time stats reflect totals

**Test Scenario 3: Multi-Day Data**
- [ ] Manually add progressHistory entries for past 7 days
- [ ] Open Stats tab
- [ ] Verify all 7 bars display
- [ ] Hover over bars to see tooltips
- [ ] Check day labels (Mon, Tue, etc.)

**Test Scenario 4: Data Pruning**
- [ ] Add progressHistory entry from 31 days ago
- [ ] Play a game
- [ ] Check Firestore
- [ ] Verify old entry was removed (only last 30 days kept)

**Expected Behavior:**
- Charts update in real-time after games
- Tooltips show exact values on hover
- Weekly totals sum correctly
- Old data (30+ days) automatically pruned

---

### 3. Review Wrong Words 📝

**Test Scenario 1: No Mistakes**
- [ ] Create new account (or clear wrongWords array)
- [ ] Open Review tab
- [ ] Verify shows "Perfect Record!" message
- [ ] No word list displayed

**Test Scenario 2: After Wrong Answers**
- [ ] Play game and intentionally get 3 words wrong
- [ ] Open Review tab
- [ ] Verify 3 words appear in list
- [ ] Check difficulty counts are correct

**Test Scenario 3: Filtering**
- [ ] Get words wrong from different difficulties
- [ ] Open Review tab
- [ ] Click "Easy" filter
- [ ] Verify only Easy words show
- [ ] Test other filters (Medium, Hard, All)

**Test Scenario 4: Practice Mode**
- [ ] Open Review tab with wrong words
- [ ] Click "Practice X Words" button
- [ ] Verify game starts with only those words
- [ ] Complete practice session
- [ ] Check if words still in wrongWords list (they should be)

**Test Scenario 5: Audio Playback**
- [ ] Get Medium difficulty word wrong
- [ ] Open Review tab
- [ ] Click speaker icon (🔊)
- [ ] Verify word is spoken aloud

**Expected Behavior:**
- Wrong words tracked across all games
- Filters work correctly
- Practice mode uses filtered word set
- Audio works for Medium difficulty
- Words remain in list until mastered

---

### 4. Quick Play Mode ⚡

**Test Scenario 1: Basic Functionality**
- [ ] Go to Play screen
- [ ] Click "Quick Play" button
- [ ] Verify game starts with 5 words
- [ ] Check words are from mixed difficulties
- [ ] Complete game

**Test Scenario 2: Progress Tracking**
- [ ] Note current sparkies count
- [ ] Play Quick Play game
- [ ] Get 3/5 correct
- [ ] Verify sparkies increased
- [ ] Check totalGames incremented
- [ ] Verify wordsLearned updated

**Test Scenario 3: Streak Counting**
- [ ] Play Quick Play on new day
- [ ] Verify daily streak increments
- [ ] Quick Play counts same as regular games

**Test Scenario 4: Random Selection**
- [ ] Play Quick Play 3 times
- [ ] Verify different words each time
- [ ] Check mix of difficulties

**Expected Behavior:**
- Always selects exactly 5 words
- Random selection from all words
- Counts toward daily streak
- Awards sparkies and updates stats
- Doesn't affect difficulty mastery percentages

---

### 5. Milestone Celebrations 🎉

**Test Scenario 1: Certificate Earned**
- [ ] Play game and get 100% score
- [ ] Verify celebration popup appears
- [ ] Check shows certificate icon (🏆)
- [ ] Verify confetti animation
- [ ] Wait 4 seconds or click to dismiss

**Test Scenario 2: Badge Unlocked**
- [ ] Trigger new badge (e.g., play first game for b1)
- [ ] Verify celebration shows badge icon
- [ ] Check title says "Badge Unlocked!"
- [ ] Verify correct badge name displayed

**Test Scenario 3: Streak Milestone**
- [ ] Reach 3-day streak
- [ ] Play game
- [ ] Verify celebration shows fire icon (🔥)
- [ ] Check title shows "3 Day Streak!"

**Test Scenario 4: Multiple Milestones**
- [ ] Trigger multiple milestones in one game
- [ ] Verify only one celebration shows
- [ ] Priority: Certificate > Badge > Streak

**Test Scenario 5: Auto-Dismiss**
- [ ] Trigger celebration
- [ ] Don't click anything
- [ ] Wait 4 seconds
- [ ] Verify automatically closes

**Expected Behavior:**
- Appears immediately after game completion
- Confetti animation plays
- Auto-dismisses after 4 seconds
- Can be manually dismissed by clicking
- Doesn't block navigation
- Shows appropriate icon and color per type

---

## Integration Testing

### Full User Journey
1. [ ] Create new student account
2. [ ] Play first game (Easy mode)
   - [ ] Streak starts at 1
   - [ ] Badge b1 unlocked → celebration
   - [ ] Progress history created
3. [ ] Check Stats tab
   - [ ] Today's data shows
   - [ ] Charts display correctly
4. [ ] Get some words wrong
5. [ ] Check Review tab
   - [ ] Wrong words listed
   - [ ] Can filter by difficulty
6. [ ] Practice wrong words
   - [ ] Game starts with filtered words
7. [ ] Play Quick Play
   - [ ] 5 random words
   - [ ] Counts toward streak
8. [ ] Play next day
   - [ ] Streak increments to 2
9. [ ] Reach 3-day streak
   - [ ] Get 2x sparkies bonus
   - [ ] Celebration appears
10. [ ] Check all stats updated correctly

---

## Edge Cases to Test

### Daily Streak
- [ ] Play at 11:59 PM, then 12:01 AM (should count as 2 days)
- [ ] Change device timezone
- [ ] Play multiple games same day
- [ ] Skip exactly 1 day vs 2+ days

### Progress Dashboard
- [ ] Play 10+ games in one day (chart scaling)
- [ ] No games for 7 days (empty chart)
- [ ] Very high sparkies numbers (display formatting)

### Review Wrong Words
- [ ] Get same word wrong multiple times (no duplicates)
- [ ] Get all words wrong (full list)
- [ ] Practice and get wrong again (stays in list)
- [ ] Clear wrongWords array manually

### Quick Play
- [ ] Less than 5 words in database
- [ ] Play Quick Play 10 times rapidly
- [ ] Mix with regular games

### Milestone Celebrations
- [ ] Trigger while another modal is open
- [ ] Rapid game completion (multiple celebrations)
- [ ] Close and immediately trigger another

---

## Performance Testing

- [ ] Load Stats tab with 30 days of data
- [ ] Review tab with 100+ wrong words
- [ ] Multiple celebrations in quick succession
- [ ] Quick Play with large word database

---

## Mobile Testing

- [ ] All features work on mobile viewport
- [ ] Bottom nav doesn't overlap content
- [ ] Charts are readable on small screens
- [ ] Celebrations fit mobile screen
- [ ] Touch interactions work smoothly

---

## Browser Testing

Test in:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## Firestore Data Validation

After testing, verify in Firestore console:

```javascript
// Student document should have:
{
  currentStreak: number,
  longestStreak: number,
  lastPlayedDate: "2026-02-13",
  wrongWords: ["e1", "m3", "h5"],
  progressHistory: [
    {
      date: "2026-02-13",
      sparkiesEarned: 45,
      wordsLearned: 8,
      gamesPlayed: 2
    }
  ]
}
```

---

## Known Limitations

1. **Streak System:**
   - Based on local date, not timezone-aware
   - No "freeze" or recovery mechanism

2. **Progress History:**
   - Limited to 30 days
   - No export functionality

3. **Wrong Words:**
   - Never automatically removed
   - Can grow large over time

4. **Quick Play:**
   - Doesn't track which words were in quick play
   - No separate quick play stats

5. **Celebrations:**
   - Only one shows at a time
   - No history of past celebrations

---

## Debugging Tips

### Check Console Logs
```javascript
// Look for these logs:
"Daily streak updated: X days"
"Progress history updated"
"Wrong words tracked: [...]"
"Milestone triggered: certificate/badge/streak"
```

### Firestore Queries
```javascript
// Get user's progress history
db.collection('users').doc(userId).get()
  .then(doc => console.log(doc.data().progressHistory))

// Check wrong words
db.collection('users').doc(userId).get()
  .then(doc => console.log(doc.data().wrongWords))
```

### Manual Testing Data
```javascript
// Add test progress history (in browser console)
const testHistory = Array.from({length: 7}, (_, i) => ({
  date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
  sparkiesEarned: Math.floor(Math.random() * 50) + 10,
  wordsLearned: Math.floor(Math.random() * 10) + 1,
  gamesPlayed: Math.floor(Math.random() * 3) + 1
}));
```

---

## Success Criteria

All features are working correctly when:
- ✅ Streaks increment daily and reset properly
- ✅ 2x sparkies bonus applies at 3+ days
- ✅ Progress charts display accurate data
- ✅ Wrong words are tracked and filterable
- ✅ Quick Play provides 5 random words
- ✅ Celebrations appear for milestones
- ✅ All data persists in Firestore
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Performance is smooth

---

**Happy Testing! 🧪**
