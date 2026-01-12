# Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Expo development server:**
   ```bash
   npm start
   ```

3. **Run on your device:**
   - Install the Expo Go app on your iOS or Android device
   - Scan the QR code displayed in the terminal
   - Or press `i` for iOS simulator, `a` for Android emulator

## Features Overview

### Home Screen
- View summary statistics (total goals, active, achieved)
- See overall progress
- Quick access to recent active goals

### Goals Screen
- View all goals with filtering (All, Active, Achieved)
- Create new goals with the floating action button
- Tap any goal to view details

### Goal Details
- View full goal information
- Log progress updates with notes
- View update history
- Delete goals

### Reports Screen
- View year-end reports
- Switch between different years
- See activity charts and statistics
- Review all goals for a specific year

## Key Features

✅ **Goal Management**
- Create up to 150 active goals per year
- Organize goals by categories
- Track progress from 0-100%

✅ **Progress Tracking**
- Log updates with progress percentage
- Add notes to updates
- Automatic achievement detection at 100%

✅ **Encouragement System**
- Celebration modals for achievements
- Milestone celebrations (25%, 50%, 75%, 90%)
- Progress encouragement messages

✅ **Year-Based Organization**
- Goals automatically tied to current year
- Year-end reports
- Historical data preservation

✅ **Beautiful UI**
- Modern, clean design
- Intuitive navigation
- Responsive layouts

## Data Storage

All data is stored locally on the device using AsyncStorage. No internet connection required!

## Notes

- The app requires image assets in the `assets/` directory (see `assets/README.md`)
- You can use placeholder images for development
- The `.expo/` directory will be created automatically when you run `npm start`

