# Vital Flow - AI Mental Wellness Companion

A React Native + Expo mobile application that helps users track their mental health through daily mood journaling, AI-powered insights, and wellness recommendations.

## 🎯 Concept

Vital Flow is an AI-powered mental wellness companion designed to help users:

- **Track Daily Mood**: Rate your emotional state and journal your thoughts
- **Get AI Insights**: Receive personalized wellness recommendations based on your entries
- **Monitor Trends**: Visualize your mood patterns over time with charts and analytics
- **Learn Wellness Tips**: Access science-backed mental health and wellness guidance

The app uses Google's Gemini AI API to analyze user journal entries and mood data, providing empathetic, actionable wellness insights without offering medical diagnosis.

## ✨ Features

### 1. Onboarding Flow
- Multi-step introduction to app features
- User profile setup (name, age, wellness goals)
- Personalized app experience based on user info

### 2. Daily Check-in
- **Mood Slider**: Rate mood from 1-10 with emoji feedback
- **Journal Entry**: Write reflections, thoughts, or observations (up to 500 characters)
- **AI Insights**: Click "Get AI Insight" to receive personalized recommendations
- **Entry Tracking**: System prevents duplicate check-ins on the same day

### 3. Dashboard Home
- Greeting with user's name and goal
- Real-time stats:
  - Current streak (consecutive days with check-ins)
  - Total check-ins completed
  - Average mood score
- Today's check-in preview
- Recent entries quick view

### 4. Mood History & Analytics
- **Trend Chart**: Visual bar chart showing last 7 days of mood data
- **Statistics**: Total entries, average mood, best mood achieved
- **Complete History**: Browse all past check-ins with full details
- **Edit/Delete**: Remove entries if needed

### 5. AI-Powered Insights
- Personalized mood pattern analysis
- Trend observations and encouragement
- Actionable wellness suggestions
- Wellness tips and best practices
- How-to guide for getting the most out of the app

### 6. Data Persistence
- **AsyncStorage Integration**: All data saved locally on device
- User profile stored and restored automatically
- Complete check-in history retained across sessions
- Onboarding state tracked (skip on return visits)

## 🛠️ Tech Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Managed React Native platform (simplified development)
- **TypeScript**: Type-safe code
- **Expo Router**: File-based navigation and routing
- **StyleSheet**: Native style management

### Storage & State
- **AsyncStorage**: Local data persistence
- React Hooks: State management (useState, useEffect)

### AI & APIs
- **Google Gemini API**: LLM for wellness insights and analysis
- **Axios**: HTTP client for API calls

### Design & UX
- Custom color scheme (Primary: #667eea)
- Responsive layout patterns
- Native iOS/Android styling
- Emoji-based visual feedback

## 📋 Project Structure

```
vital-flow-wellness/
├── app/
│   ├── _layout.tsx                 # Root navigation & onboarding check
│   ├── onboarding/
│   │   └── index.tsx               # Multi-step onboarding flow
│   └── (tabs)/
│       ├── _layout.tsx             # Tab navigation structure
│       ├── home.tsx                # Dashboard & overview
│       ├── checkin.tsx             # Daily mood check-in form
│       ├── history.tsx             # Mood history & analytics
│       └── insights.tsx            # AI insights & wellness tips
├── utils/
│   ├── storage.ts                  # AsyncStorage functions & types
│   └── aiService.ts                # Gemini API integration
├── hooks/
│   └── useCheckInData.ts           # Custom React hooks
├── assets/                         # App icons and splash screens
├── package.json                    # Dependencies
├── app.json                        # Expo configuration
├── .env.example                    # Environment variables template
├── tsconfig.json                   # TypeScript configuration
├── QUICKSTART.md                   # Quick start guide
├── SETUP_INSTRUCTIONS.md           # Detailed setup steps
└── README.md                       # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator (or physical device)
- Google Gemini API key (free tier available)

### Quick Installation (5 minutes)

```bash
# Clone the repository
git clone https://github.com/primesama05-glitch/VITAL_FLOW.git
cd VITAL_FLOW

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Gemini API key

# Start the app
npm start
```

**Full detailed setup instructions**: See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)

**Quick reference**: See [QUICKSTART.md](./QUICKSTART.md)

## 💡 How to Use

### First Time Users
1. **Complete Onboarding**: Follow the 4-step introduction
2. **Create Profile**: Enter your name, age, and wellness goal
3. **Make First Check-in**: Go to "Check In" tab and create your first entry

### Daily Workflow
1. Open "Check In" tab
2. Select your mood (1-10 scale)
3. Write a journal entry about your day/feelings
4. (Optional) Click "Get AI Insight" for personalized recommendation
5. Save your check-in
6. View your progress in "Home" and "History" tabs

### Viewing Your Data
- **Home**: Quick overview of today and recent trends
- **History**: Detailed mood chart and all past entries
- **Insights**: AI analysis and wellness recommendations

## 🤖 AI Integration Details

### Gemini API Usage

The app integrates Google's Gemini 1.5 Flash model for:

1. **Wellness Insights**
   - Analyzes user's mood, journal entry, and wellness goal
   - Considers 7-day mood history
   - Provides empathetic, actionable recommendations
   - 2-3 sentence responses designed for quick reading

2. **Mood Pattern Analysis**
   - Analyzes 7-10 recent check-ins
   - Identifies trends (improving/declining mood)
   - Suggests actionable wellness improvements
   - Encourages user progress

### Getting Your API Key
1. Visit: https://aistudio.google.com/app/apikeys
2. Click "Create API Key"
3. Copy your key and add to `.env`:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
   ```

## 📊 Data Models

### UserProfile
```typescript
{
  name: string;
  age: number;
  goal: string;
  createdAt: string;
}
```

### CheckIn
```typescript
{
  id: string;
  date: string;           // YYYY-MM-DD
  mood: number;           // 1-10
  journal: string;        // User's journal entry
  aiInsight?: string;     // AI-generated insight
  timestamp: number;      // Unix timestamp
}
```

## �� Design System

### Color Palette
- **Primary**: #667eea (Purple/Blue)
- **Success**: #28a745 (Green)
- **Warning**: #ffd93d (Yellow)
- **Danger**: #ff6b6b (Red)
- **Info**: #4ecdc4 (Teal)
- **Background**: #f8f9fa (Light Gray)

### Typography
- **Headlines**: 700 weight, 20-28px
- **Body**: 400 weight, 14-16px
- **Captions**: 400 weight, 11-12px

## ⚠️ Known Limitations

1. **API Key Required**: App requires valid Gemini API key to generate insights
   - Free tier available but rate-limited (~60 requests/minute)
   - Fallback messages provided if API fails

2. **Local Storage Only**: All data stored on device
   - No cloud sync between devices
   - Data lost if app cache is cleared
   - No backup functionality

3. **No Medical Diagnosis**: App explicitly designed NOT to provide medical advice
   - Insights are supportive, not diagnostic
   - Users should consult healthcare providers for medical concerns

4. **Offline Functionality**: 
   - Can create check-ins offline
   - AI insights require internet connection
   - API failures handled gracefully with error messages

5. **Data Capacity**: Performance optimal with 200-300 check-ins
   - No pagination yet
   - Large datasets may impact scroll performance

## 🔒 Privacy & Security

- **No Server Storage**: All data remains on user's device
- **No Tracking**: No user analytics or telemetry
- **API Key**: Never commit actual keys to git (use `.env`)
- **HTTPS Only**: API calls use secure HTTPS
- **No Data Sharing**: User data not shared with third parties

## 🐛 Troubleshooting

### App won't start
```bash
# Clear cache and rebuild
npm start -- --clear

# If issue persists:
rm -rf node_modules package-lock.json
npm install
npm start
```

### API calls failing
1. Check internet connection
2. Verify Gemini API key in `.env`
3. Check rate limits (free tier: 60 req/min)
4. Review API key permissions: https://aistudio.google.com/app/apikeys

### Data not persisting
1. Check if AsyncStorage permissions enabled (usually automatic)
2. Ensure not clearing app data/cache
3. Check device storage space

**See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for more troubleshooting**

## 📱 Platform Support

- **iOS**: 13.0+ (requires iOS Simulator or device)
- **Android**: 5.0+ (API level 21+, requires emulator or device)
- **Web**: Partial support (responsive layout, limited features)

## 🚀 Future Enhancements

Potential features for future releases:

- Cloud sync with Firebase
- Export data as PDF/CSV
- Meditation/breathing exercise guidance
- Social sharing (anonymized)
- Habit tracking integration
- Notifications for daily reminders
- Dark mode support
- Multi-language support
- Apple Health/Google Fit integration
- Emergency resources (crisis hotlines)

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support & Feedback

For issues, feature requests, or feedback:
- Open an issue on GitHub
- Check [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for help
- Review [QUICKSTART.md](./QUICKSTART.md) for quick reference

## ⚡ Performance Tips

1. **For Users**:
   - Enable notifications for daily reminders
   - Archive old data if app slows down
   - Keep latest 100 entries for best performance

2. **For Developers**:
   - Use React.memo for list items
   - Implement FlatList for large datasets
   - Optimize re-renders with useCallback
   - Monitor bundle size with `npm run build:web`

## 🎓 Learning Resources

Concepts used in this project:

- [React Native Docs](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [TypeScript in React](https://react-typescript-cheatsheet.netlify.app)
- [Google Gemini API](https://ai.google.dev/tutorials/python_quickstart)
- [AsyncStorage Best Practices](https://react-native-async-storage.github.io/async-storage)
- [Expo Router Navigation](https://docs.expo.dev/routing/introduction)

## 📊 Recommended Next Steps

After setup:

1. **Explore the Code**
   - Start with `app/_layout.tsx` (navigation)
   - Review `app/(tabs)/home.tsx` (main screen)
   - Check `utils/storage.ts` (data persistence)
   - Study `utils/aiService.ts` (AI integration)

2. **Test All Features**
   - Complete onboarding
   - Create multiple check-ins
   - Test AI insights
   - Review mood trends
   - Check streak counter

3. **Customize for Your Needs**
   - Modify colors and themes
   - Update wellness tips
   - Adjust AI prompts
   - Add new features

4. **Deploy (Optional)**
   - Build for iOS: `eas build --platform ios`
   - Build for Android: `eas build --platform android`
   - Publish to app stores

---

Built with ❤️ for better mental wellness. Stay healthy! 🌟

**Questions?** See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) or [QUICKSTART.md](./QUICKSTART.md)
