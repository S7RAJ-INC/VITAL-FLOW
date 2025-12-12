# Quick Start Guide - Vital Flow

## 1️⃣ Prerequisites
Make sure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI: `npm install -g expo-cli`

## 2️⃣ Installation (5 minutes)

```bash
# Clone the repository
git clone https://github.com/primesama05-glitch/VITAL_FLOW.git
cd VITAL_FLOW

# Install all dependencies
npm install

# Copy environment template and add your API key
cp .env.example .env

# Get your free Gemini API key at:
# https://aistudio.google.com/app/apikeys
# Then edit .env and add your key:
# EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
```

## 3️⃣ Run the App

```bash
# Start development server
npm start

# Then press:
# 'i' for iOS Simulator (Mac only)
# 'a' for Android Emulator
# 'w' for Web browser
# Or scan QR code with Expo Go app
```

## 4️⃣ First Time Using the App

1. Complete the onboarding (4 steps)
2. Enter your name, age, and wellness goal
3. Create your first mood check-in
4. (Optional) Generate an AI insight
5. Explore other tabs: History, Insights, Home

## 📱 Device Testing

### iOS Simulator
- Mac only
- Install Xcode first
- Run: `npm start` then press `i`

### Android Emulator
- Install Android Studio
- Create virtual device
- Run emulator first, then `npm start` then press `a`

### Physical Device
- Install Expo Go from App Store/Play Store
- Run `npm start`
- Scan QR code from terminal

## 🔑 Getting Your API Key

1. Visit: https://aistudio.google.com/app/apikeys
2. Click "Create API Key"
3. Select your project
4. Copy the generated key
5. Add to `.env` file:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
   ```

## 🐛 Troubleshooting

### "npm install" fails
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### App won't start
```bash
npm start -- --clear
```

### API key not working
- Check `.env` file exists (not `.env.example`)
- Verify key is copied correctly
- Check at https://aistudio.google.com/app/apikeys

### Port already in use
```bash
npm start -- --port 8082
```

## 📚 Project Structure Quick Reference

```
app/
├── _layout.tsx          → Main navigation logic
├── onboarding/          → Intro & profile setup
└── (tabs)/              → Main app screens
    ├── home.tsx         → Dashboard
    ├── checkin.tsx      → Mood entry
    ├── history.tsx      → Mood trends
    └── insights.tsx     → AI recommendations

utils/
├── storage.ts           → Data persistence (AsyncStorage)
└── aiService.ts         → Gemini API calls
```

## ✨ Key Features to Try

### Home Tab
- View your mood streak
- See today's check-in status
- Quick overview of recent entries

### Check-in Tab
- Rate your mood 1-10
- Journal your thoughts
- Click "Get AI Insight" for recommendations
- Save your entry

### History Tab
- View 7-day mood chart
- See all past entries
- Check mood statistics
- Delete entries if needed

### Insights Tab
- Get AI analysis of your mood patterns
- Read wellness tips
- Learn how to use the app better

## 🎯 Tips for Best Experience

1. **Daily Journaling**: Write genuine journal entries for better insights
2. **Consistent Tracking**: Check in daily to build a mood history
3. **Read Insights**: The AI needs at least 2 entries to analyze patterns
4. **Review History**: Use charts to spot your mood patterns
5. **Apply Tips**: Implement wellness suggestions for better results

## 📞 Need Help?

- Check [main README.md](./README.md) for detailed docs
- Review troubleshooting section
- Check console logs: `Logs` button in Expo Go
- Open an issue on GitHub

---

**Happy tracking! Your mental wellness journey starts here. 🌟**
