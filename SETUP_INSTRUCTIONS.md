# Complete Setup Instructions - Vital Flow

## 📌 Overview

This guide will walk you through setting up and running the Vital Flow React Native Expo app on your development machine.

**Estimated setup time: 10-15 minutes**

## ✅ System Requirements

- **Operating System**: macOS, Linux, or Windows
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **RAM**: Minimum 4GB (8GB+ recommended)
- **Disk Space**: ~5GB for dependencies and emulators

## 🔧 Step 1: Install Node.js

### macOS (using Homebrew)
```bash
brew install node
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nodejs npm
```

### Windows
1. Download from https://nodejs.org/
2. Run installer and follow prompts
3. Verify: `node --version` and `npm --version`

## 🚀 Step 2: Install Expo CLI

```bash
npm install -g expo-cli
```

Verify installation:
```bash
expo --version
```

## 📂 Step 3: Clone and Setup Project

```bash
# Clone repository
git clone https://github.com/primesama05-glitch/VITAL_FLOW.git
cd VITAL_FLOW

# Install dependencies
npm install

# This may take 2-3 minutes - wait for completion
```

## 🔑 Step 4: Configure API Key

### Get Gemini API Key

1. Visit: https://aistudio.google.com/app/apikeys
2. Click **"Create API Key"** button
3. Follow the prompts (you may need to create a Google Cloud project)
4. Copy your API key

### Add to Project

1. Open the `.env` file in VITAL_FLOW folder (not `.env.example`)
   - If `.env` doesn't exist, create it

2. Add this line:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_actual_key_here
   ```

3. Replace `your_actual_key_here` with your actual API key

4. Save the file

**⚠️ Important**: Never commit `.env` file to Git (already in `.gitignore`)

## 📱 Step 5: Run the App

### Terminal Setup
```bash
# Navigate to project folder
cd VITAL_FLOW

# Start development server
npm start
```

You should see:
```
✓ Metro bundler started

> Local:   exp://xxx.xxx.xxx.xxx:19000
> LAN:    exp://xxx.xxx.xxx.xxx:19000

Scan this QR code with Expo Go. Command line interface usage below.
Press 'i' to open iOS Simulator (macOS only)
Press 'a' to open Android Emulator
Press 'w' to open in web browser
Press 'r' to reload app
Press 'm' to toggle menu
```

### Choose Your Platform

#### iOS Simulator (Mac Only)
```
Press 'i' in terminal
# Simulator will open automatically
```

**Requirements**:
- macOS (Monterey or newer)
- Xcode Command Line Tools: `xcode-select --install`

#### Android Emulator
```
Press 'a' in terminal
# Make sure Android Emulator is running first
```

**Requirements**:
- Android Studio installed
- Android Emulator configured
- [Setup guide](https://developer.android.com/studio/run/emulator)

#### Physical Device
1. Install **Expo Go** app from:
   - iOS: App Store
   - Android: Google Play Store

2. Open Expo Go app
3. Scan QR code from terminal
4. App loads on your device

#### Web Browser
```
Press 'w' in terminal
# Opens in http://localhost:19006
# Note: Limited features compared to native
```

## ✨ First Launch

When you first open the app:

1. **Onboarding Screen**: Follow 4 intro steps
2. **Profile Setup**: Enter:
   - Your name
   - Your age
   - Your wellness goal
3. **Create First Check-in**: 
   - Select your mood (1-10)
   - Write a journal entry
   - (Optional) Get AI insight
   - Save entry

## 🧪 Testing the Features

### Test Checklist
- [ ] Onboarding completed without errors
- [ ] Profile saved and appears on home
- [ ] Can create mood check-in
- [ ] AI insight generates (if API key working)
- [ ] Check-in appears on history
- [ ] Home shows stats correctly
- [ ] Chart displays in history

### Common Test Scenarios
1. **No API Key**: App works but insights show fallback message
2. **Offline**: Check-ins work, insights fail with error
3. **New Install**: Should show onboarding first
4. **Return Visit**: Should go straight to home

## 🔧 Development Workflow

### Hot Reload
- Save a file: App automatically reloads
- Press `r` in terminal: Manual reload

### Debug
- Press `m` in terminal: Open menu
- Select "Debug remote JS"
- Opens Chrome DevTools for debugging

### View Logs
- **Expo Go**: Tap "Logs" button in app
- **Terminal**: Logs appear automatically
- **DevTools**: Console shows messages

## 🐛 Troubleshooting

### Issue: "npm install" Fails

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: "Cannot find module" Errors

**Solution**:
```bash
npm install
npm start -- --clear
```

### Issue: App Won't Start / Blank Screen

**Solution**:
```bash
# Clear cache and restart
npm start -- --clear

# If still failing:
rm -rf .expo
npm start
```

### Issue: API Key Not Working

**Checklist**:
- [ ] `.env` file exists (not `.env.example`)
- [ ] Key is correctly copied (no spaces)
- [ ] Expo app restarted after adding key
- [ ] Key is valid at https://aistudio.google.com/app/apikeys
- [ ] Internet connection working

### Issue: Android Emulator Won't Start

**Solution**:
1. Open Android Studio
2. Go to AVD Manager
3. Click play button for your emulator
4. Wait until fully loaded
5. Then run: `npm start` → press `a`

### Issue: iOS Simulator Doesn't Open

**Solution**:
```bash
# Install Xcode command line tools
xcode-select --install

# Then try again
npm start
```

### Issue: Port 19000 Already in Use

**Solution**:
```bash
npm start -- --port 8082
```

## 📊 Project Directory Structure

```
VITAL_FLOW/
├── app/                    # App screens & navigation
│   ├── _layout.tsx        # Root navigation & routing
│   ├── onboarding/        # Onboarding screens
│   │   └── index.tsx
│   └── (tabs)/            # Tab navigation
│       ├── _layout.tsx
│       ├── home.tsx       # Home/dashboard
│       ├── checkin.tsx    # Check-in form
│       ├── history.tsx    # History & charts
│       └── insights.tsx   # Insights & tips
│
├── utils/
│   ├── storage.ts         # AsyncStorage functions
│   └── aiService.ts       # Gemini API integration
│
├── hooks/
│   └── useCheckInData.ts  # Custom React hook
│
├── package.json           # Dependencies
├── app.json              # Expo config
├── tsconfig.json         # TypeScript config
├── .env                  # API keys (gitignored)
├── .env.example          # Template
└── README.md             # Full documentation
```

## 📚 Useful Commands

```bash
# Start dev server
npm start

# Clear cache and restart
npm start -- --clear

# Run on iOS
npm start -- --ios

# Run on Android
npm start -- --android

# Run in web browser
npm start -- --web

# Install dependencies
npm install

# Install specific package
npm install package-name

# View logs
npm start -- --verbose

# Stop server (Ctrl+C in terminal)
```

## 🎯 Next Steps After Setup

1. **Explore the Code**
   - Start with `app/_layout.tsx`
   - Review `app/(tabs)/home.tsx`
   - Check `utils/storage.ts` and `utils/aiService.ts`

2. **Make Your First Check-in**
   - Open app
   - Complete onboarding
   - Create mood entry
   - Generate AI insight

3. **Understand Features**
   - Home: Dashboard & stats
   - Check-in: Mood entry form
   - History: Trends & visualization
   - Insights: AI analysis & tips

4. **Customize**
   - Change colors in StyleSheet
   - Modify wellness tips
   - Add more AI prompts
   - Implement new features

## 📞 Getting Help

### Resources
- [React Native Docs](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [Gemini API Docs](https://ai.google.dev)
- [TypeScript Guide](https://www.typescriptlang.org/docs)

### Debugging Tips
1. Check terminal for error messages
2. Review console logs in Expo Go
3. Use Chrome DevTools (press `m` → "Debug remote JS")
4. Check `.env` configuration
5. Verify API key validity

### Common Issues
- See Troubleshooting section above
- Check [main README.md](./README.md)
- Review [QUICKSTART.md](./QUICKSTART.md)

## ✅ Verification Checklist

After setup, verify:

- [ ] Node.js 18+ installed
- [ ] Expo CLI installed
- [ ] Project dependencies installed
- [ ] API key added to `.env`
- [ ] App runs on simulator/emulator/device
- [ ] Onboarding displays correctly
- [ ] Can create mood check-in
- [ ] Home screen shows data
- [ ] History tab displays chart
- [ ] Insights tab loads properly

## 🎉 Success!

Once you see the app running on your device/simulator:

1. Your development environment is set up! ✨
2. You're ready to start using the app
3. You can begin making modifications and enhancements
4. Have fun building! 🚀

---

**Need more help?** Check the [full README.md](./README.md) for detailed documentation.
