# Fomio Mobile - React Native App

A mobile-native version of the Fomio social media platform, built with React Native using Expo, Apollo GraphQL, and NativeWind. The app integrates with a Discourse backend through a unified data layer that supports both REST and GraphQL APIs.

## 🚀 Current Status

**Version**: 0.0.100 (Pre-Launch Audit Phase)  
**Status**: In development - preparing for beta release  
**Architecture**: Unified data layer with REST/GraphQL fallback

## 📱 Features

- **Cross-platform**: Runs on iOS, Android, and Web
- **Unified Data Layer**: Automatic fallback from GraphQL to REST API
- **Modern UI**: Built with custom components and NativeWind
- **Dark/Light Mode**: Automatic theme switching with manual override
- **Responsive Design**: Optimized for mobile devices
- **Type-safe**: Full TypeScript support
- **File-based Routing**: Using Expo Router for intuitive navigation
- **Authentication**: WebView-based Discourse authentication
- **Real-time Updates**: Apollo GraphQL with optimistic updates

## 🏗 Architecture

### Data Layer

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   UI Components │    │   Data Provider  │    │   BFF Server    │
│                 │◄───┤                  │◄───┤   (GraphQL)     │
│  - Feed Screen  │    │  - Health Check  │    │                 │
│  - Compose      │    │  - Auto Fallback │    └─────────────────┘
│  - Profile      │    │  - Unified API   │             │
└─────────────────┘    └──────────────────┘             │
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   REST Adapter   │    │ Discourse API   │
                       │   (Fallback)     │◄───┤   (REST)       │
                       └──────────────────┘    └─────────────────┘
```

### Authentication Flow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Sign In   │───►│   WebView    │───►│  Discourse  │
│   Screen    │    │   Auth       │    │   Backend   │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Session   │◄───│   Token      │◄───│   Cookies    │
│   Storage   │    │   Extraction │    │   & CSRF     │
└─────────────┘    └──────────────┘    └─────────────┘
```

## 📁 Project Structure

```
FomioMobile/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Authentication screens
│   │   ├── _layout.tsx
│   │   ├── onboarding.tsx
│   │   ├── signin.tsx
│   │   └── signup.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── index.tsx             # Feed screen
│   │   ├── compose.tsx           # Create post
│   │   ├── notifications.tsx     # Notifications
│   │   └── settings.tsx          # Settings
│   ├── feed/                     # Feed screens
│   │   └── [byteId].tsx          # Byte detail
│   ├── (profile)/                # Profile screens
│   │   ├── index.tsx
│   │   └── edit-profile.tsx
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Home screen
├── components/                   # Reusable components
│   ├── ui/                       # UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── feed/                     # Feed-specific components
│   │   ├── ByteCard.tsx
│   │   └── ByteBlogPage.tsx
│   └── shared/                   # Shared components
│       ├── theme-provider.tsx
│       ├── apollo-provider.tsx
│       ├── auth-provider.tsx
│       └── ...
├── data/                         # Data layer (NEW)
│   ├── client.ts                 # Data client interface
│   ├── rest.ts                   # REST implementation
│   ├── gql.ts                    # GraphQL implementation
│   └── provider.tsx              # Runtime provider
├── hooks/                        # Custom hooks
│   ├── useFeed.ts
│   ├── useAuth.ts
│   ├── useCreatePost.ts
│   └── ...
├── lib/                          # Core libraries
│   ├── apollo.ts                 # Apollo Client setup
│   ├── auth.ts                   # Authentication logic
│   └── apiClient.ts              # API client
├── shared/                       # Shared utilities
│   ├── form-validation.tsx
│   ├── logger.ts
│   └── theme-constants.ts
├── CHANGELOG.md                  # Version history
├── PRE_LAUNCH_AUDIT.md           # Audit checklist
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd FomioMobile
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Run on different platforms**
   - **iOS**: Press `i` or run `npm run ios`
   - **Android**: Press `a` or run `npm run android`
   - **Web**: Press `w` or run `npm run web`

## 🔧 Environment Configuration

Create a `.env` file in the root directory:

```bash
# API Configuration
EXPO_PUBLIC_API_MODE=rest                    # "rest" or "bff"
EXPO_PUBLIC_BFF_URL=http://localhost:8080    # BFF GraphQL server URL
EXPO_PUBLIC_DISCOURSE_API=https://meta.techrebels.info  # Discourse API URL

# Deep Linking
EXPO_PUBLIC_DEEP_LINK_SCHEME=fomio          # Deep link scheme
```

**Note**: After changing environment variables, restart the Expo development server.

## 🛠 Development Scripts

```bash
# Development
npm start                    # Start Expo dev server
npm run ios                  # Run on iOS simulator
npm run android              # Run on Android emulator
npm run web                  # Run on web

# Code Quality
npm run lint                 # Run ESLint
npm run fmt                  # Format code with Prettier
npm run typecheck            # Run TypeScript compiler
npm run doctor               # Run Expo doctor

# Testing
npm test                     # Run tests
npm run test:coverage        # Run tests with coverage
npm run test:watch           # Run tests in watch mode

# Analysis
npm run deps:unused          # Find unused dependencies
npm run types:unused         # Find unused TypeScript exports
npm run release              # Generate new version
```

## 📊 Data Layer Usage

The app uses a unified data layer that automatically falls back from GraphQL to REST:

```typescript
import { useData } from '../data/provider';

function FeedScreen() {
  const data = useData();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    // This will use GraphQL if BFF is available, REST otherwise
    data.getFeed().then(setTopics);
  }, []);

  return <FlatList data={topics} renderItem={TopicCard} />;
}
```

## 🔐 Authentication

The app uses WebView-based authentication with Discourse:

```typescript
import { useAuth } from '../hooks/useAuth';

function SignInScreen() {
  const { startLogin, isAuthenticated } = useAuth();

  const handleSignIn = async () => {
    await startLogin(); // Opens WebView for Discourse auth
  };

  return (
    <Button onPress={handleSignIn}>
      Sign In to TechRebels
    </Button>
  );
}
```

## 🎨 Theming

The app supports automatic dark/light mode switching:

```typescript
import { useTheme } from '../components/shared/theme-provider';

function MyComponent() {
  const { isDark, isAmoled } = useTheme();

  return (
    <View style={{
      backgroundColor: isAmoled ? '#000000' : (isDark ? '#18181b' : '#ffffff')
    }}>
      {/* Content */}
    </View>
  );
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test files
npm test -- __tests__/api/discourse.test.ts

# Run with coverage
npm run test:coverage
```

## 📱 Platform Support

- **iOS**: iPhone, iPad (with split view support)
- **Android**: Phone, tablet (Material Design)
- **Web**: Chrome, Safari, Firefox (PWA ready)

## 🚀 Deployment

### Development Builds

```bash
# iOS
eas build --platform ios --profile development

# Android
eas build --platform android --profile development
```

### Production Builds

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

## 📚 Documentation

- [CHANGELOG.md](./CHANGELOG.md) - Version history and changes
- [PRE_LAUNCH_AUDIT.md](./PRE_LAUNCH_AUDIT.md) - Current audit progress
- [docs/archive/](./docs/archive/) - Archived implementation docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Discourse team for the excellent forum platform
- Expo team for the development platform
- Apollo GraphQL team for the client library
- React Native community for the ecosystem
- TechRebels community for inspiration and feedback
