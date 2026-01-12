# Fixing PlatformConstant Error

This error typically occurs due to:
1. Native module cache issues
2. Babel config not being applied
3. Version mismatches
4. Expo Go app cache

## Step-by-Step Fix

### Step 1: Stop Everything
```bash
# Stop the Metro bundler (Ctrl+C)
# Close Expo Go app completely on your device
```

### Step 2: Clean Everything
```bash
# Remove all caches and build artifacts
rm -rf node_modules
rm -rf .expo
rm -rf ~/.expo
rm -rf ios/build android/build
rm -rf package-lock.json yarn.lock

# Clear npm cache
npm cache clean --force
```

### Step 3: Reinstall
```bash
npm install
```

### Step 4: Verify Babel Config
Make sure `babel.config.js` has the reanimated plugin:
```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
```

### Step 5: Start Fresh
```bash
# Start with cache cleared
npx expo start --clear
```

### Step 6: If Using Expo Go
- **Uninstall and reinstall Expo Go** on your device
- Make sure you're using the latest version
- Scan the QR code again

## Alternative: Try Without Reanimated

If the above doesn't work, we can temporarily remove react-native-reanimated since we're not using it directly. However, it's required by react-navigation, so this might cause other issues.

## Check Your Expo Go Version

Make sure your Expo Go app version matches your Expo SDK:
- Expo SDK 54 requires Expo Go 2.x or higher
- Update Expo Go from App Store/Play Store if needed

## If Still Not Working

Try creating a minimal test app to isolate the issue:

1. Create a simple `App.js`:
```js
import React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Test App</Text>
    </View>
  );
}
```

2. If this works, the issue is in our navigation setup
3. If this doesn't work, it's an Expo/React Native setup issue
