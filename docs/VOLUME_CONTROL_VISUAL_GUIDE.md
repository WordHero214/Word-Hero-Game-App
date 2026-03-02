# 🎨 Volume Control - Visual Guide

## Location in Game Screen

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  [✕]              [🔊]                    [⏱ 30]  │  ← Top Bar
│                     ↓                               │
│              ┌─────────────┐                        │
│              │ Music Volume│                        │
│              │ ▓▓▓░░░░ 15% │                        │
│              │ [Off][Low]  │                        │
│              │    [High]   │                        │
│              │ 💡 Tip text │                        │
│              └─────────────┘                        │
│                                                     │
│                                                     │
│              [Game Content Area]                    │
│                                                     │
│              • Word clues                           │
│              • Input field                          │
│              • Buttons                              │
│                                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Button States

### Muted (0%)
```
[🔇]  ← Click to open volume control
```

### Low Volume (< 30%)
```
[🔉]  ← Click to open volume control
```

### High Volume (≥ 30%)
```
[🔊]  ← Click to open volume control
```

## Volume Control Panel (Expanded)

```
┌──────────────────────────────┐
│  Music Volume          15%   │  ← Current percentage
│  ▓▓▓▓░░░░░░░░░░░░░░░░░░░░   │  ← Gradient slider
│                              │
│  [🔇 Off] [🔉 Low] [🔊 High] │  ← Quick presets
│                              │
│  💡 Lower volume helps hear  │  ← Helpful tip
│     word audio better        │
└──────────────────────────────┘
```

## Slider Interaction

### Dragging the Slider
```
Before:  ▓▓▓░░░░░░░░░░░░░░░░░  (15%)
         ↓ Drag right
After:   ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░  (50%)
```

### Hover Effect
```
Normal:  ●────────────────────  (Thumb)
Hover:   ◉────────────────────  (Larger + Glow)
```

## Quick Preset Buttons

### Off Button
```
┌─────────┐
│ 🔇 Off  │  ← Click to mute (0%)
└─────────┘
```

### Low Button (Recommended)
```
┌─────────┐
│ 🔉 Low  │  ← Click for 15% (Best for Medium mode)
└─────────┘
```

### High Button
```
┌─────────┐
│ 🔊 High │  ← Click for 50%
└─────────┘
```

## Usage Flow

```
1. Student starts game
   ↓
2. Background music plays at 15% (default)
   ↓
3. Student clicks [🔊] button
   ↓
4. Volume panel appears
   ↓
5. Student adjusts slider or clicks preset
   ↓
6. Music volume changes instantly
   ↓
7. Student continues playing with preferred volume
```

## Recommended Settings by Difficulty

### Easy Mode (Hints Only)
```
[🔊] Any volume is fine
     No audio to hear
```

### Medium Mode (Audio Pronunciation)
```
[🔉] Low (15%) or Off (0%)
     Need to hear word clearly!
```

### Hard Mode (Scenario Only)
```
[🔊] Any volume is fine
     No audio to hear
```

## Mobile View

```
┌──────────────────────┐
│                      │
│ [✕]  [🔊]  [⏱ 30]  │
│        ↓             │
│   ┌──────────┐       │
│   │ Volume   │       │
│   │ ▓▓░░ 15% │       │
│   │ [Off]    │       │
│   │ [Low]    │       │
│   │ [High]   │       │
│   └──────────┘       │
│                      │
│   [Game Area]        │
│                      │
└──────────────────────┘
```

## Color Scheme

- **Background:** Dark blue (#162031)
- **Slider Track:** Very dark (#0b1221)
- **Slider Fill:** Teal gradient (#00c2a0)
- **Slider Thumb:** Teal (#00c2a0) with glow
- **Text:** White with gray accents
- **Tip Text:** Light gray (#9ca3af)

## Animation Effects

### Panel Appearance
```
Hidden → Slide down from top (200ms)
```

### Slider Thumb
```
Normal → Hover: Scale 1.2x + Glow
Hover → Active: Scale 1.1x
```

### Button Hover
```
Normal → Hover: Slight background change
Hover → Click: Scale 0.95x (press effect)
```

---

**Visual Guide Complete!**  
Students will find the volume control intuitive and easy to use during gameplay.
