# Troubleshooting Guide

## PlatformConstant Error

If you're seeing the error: `'PlatformConstant' could not be found. Verify that a module by this name is registered in the native binary`

This usually indicates a cache or native module issue. Try these steps in order:

### Solution 1: Clear Cache and Restart

1. **Stop the Expo server** (Ctrl+C)

2. **Clear all caches:**
   ```bash
   # Clear Metro bundler cache
   npx expo start --clear
   
   # Or manually clear:
   rm -rf node_modules
   npm install
   npx expo start --clear
   ```

3. **If using Expo Go app:**
   - Close and reopen the Expo Go app on your device
   - Scan the QR code again

### Solution 2: Reset Everything

If Solution 1 doesn't work:

```bash
# Remove all caches and node_modules
rm -rf node_modules
rm -rf .expo
rm -rf ~/.expo
npm cache clean --force

# Reinstall dependencies
npm install

# Start fresh
npx expo start --clear
```

### Solution 3: Check Version Compatibility

Make sure your versions are compatible:
- Expo SDK 54 should work with React Native 0.73.x
- babel-preset-expo should be ~11.0.0 for Expo SDK 54

### Solution 4: Rebuild Native Code (if using development build)

If you're using a development build (not Expo Go):

```bash
# For iOS
cd ios && pod install && cd ..
npx expo run:ios

# For Android
npx expo run:android
```

### Solution 5: Check for Conflicting Packages

Sometimes certain packages can cause issues. Make sure all your dependencies are compatible with Expo SDK 54.

## Common Issues

### Metro Bundler Cache
Always try `--clear` flag first:
```bash
npx expo start --clear
```

### Node Modules Issues
If you see module resolution errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Expo Go App Issues
- Make sure you're using the latest version of Expo Go
- Try uninstalling and reinstalling Expo Go
- Make sure your device and computer are on the same network

