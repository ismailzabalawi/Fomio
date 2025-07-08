# Fomio Mobile - React Native App

A mobile-native version of the Fomio social media platform, migrated from Next.js to React Native using Expo, Gluestack UI, and NativeWind.

## 🚀 Features

- **Cross-platform**: Runs on iOS, Android, and Web
- **Modern UI**: Built with Gluestack UI components
- **Dark/Light Mode**: Automatic theme switching with manual override
- **Responsive Design**: Optimized for mobile devices
- **Type-safe**: Full TypeScript support
- **File-based Routing**: Using Expo Router for intuitive navigation

## 📱 Screens

### Authentication Flow
- **Home Screen** (`/`) - Welcome page with app introduction
- **Onboarding** (`/(auth)/onboarding`) - Multi-step introduction
- **Sign In** (`/(auth)/signin`) - User authentication
- **Sign Up** (`/(auth)/signup`) - Account creation

### Main App Flow
- **Feed** (`/feed`) - Main content feed with bytes
- **Byte Details** (`/feed/[byteId]`) - Individual byte view with comments
- **Compose** (`/compose`) - Create new bytes
- **Profile** (`/(profile)`) - User profile and settings

## 🛠 Tech Stack

### Core Framework
- **React Native** - Mobile app framework
- **Expo** - Development platform and tooling
- **Expo Router** - File-based navigation

### UI & Styling
- **Gluestack UI** - Component library
- **NativeWind** - Tailwind CSS for React Native
- **Lucide React Native** - Icon system

### State Management
- **Zustand** - Lightweight state management
- **AsyncStorage** - Local data persistence
- **Custom Hooks** - Shared business logic

### Development
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📁 Project Structure

```
FomioMobile/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Authentication screens
│   │   ├── _layout.tsx
│   │   ├── onboarding.tsx
│   │   ├── signin.tsx
│   │   └── signup.tsx
│   ├── feed/                     # Feed screens
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── [byteId].tsx
│   ├── (profile)/                # Profile screens
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── _layout.tsx               # Root layout
│   ├── index.tsx                 # Home screen
│   └── compose.tsx               # Compose screen
├── components/                   # Reusable components
│   ├── ui/                       # UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   ├── switch.tsx
│   │   ├── textarea.tsx
│   │   └── index.ts
│   └── shared/                   # Shared components
│       ├── theme-provider.tsx
│       └── theme-toggle.tsx
├── shared/                       # Business logic hooks
│   ├── useAuth.ts
│   ├── useCreateByte.ts
│   ├── useFeed.ts
│   └── index.ts
├── theme/                        # Theme configuration
│   └── gluestack-ui.config.ts
├── assets/                       # Static assets
├── global.css                    # Global styles
├── tailwind.config.js            # Tailwind configuration
├── nativewind.config.ts          # NativeWind configuration
└── package.json
```

## 🚀 Getting Started

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

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on different platforms**
   - **iOS**: Press `i` or run `npm run ios`
   - **Android**: Press `a` or run `npm run android`
   - **Web**: Press `w` or run `npm run web`

### Development

- **Start development server**: `npm start`
- **Run on iOS simulator**: `npm run ios`
- **Run on Android emulator**: `npm run android`
- **Run on web**: `npm run web`
- **Run tests**: `npm test`

## 🎨 UI Components

### Available Components

All components are built with Gluestack UI and support light/dark themes:

- **Button** - Various styles and sizes
- **Input** - Text input with validation
- **Card** - Content containers
- **Avatar** - User profile images
- **Badge** - Labels and tags
- **Tabs** - Navigation tabs
- **Switch** - Toggle controls
- **Textarea** - Multi-line text input

### Usage Example

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onPress={() => console.log('Pressed!')}>
          Click me
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 🔧 Configuration

### Theme Configuration

The app supports automatic dark/light mode switching based on system preferences, with manual override available.

**Theme Provider Setup:**
```tsx
import { ThemeProvider } from '@/components/shared/theme-provider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### NativeWind Configuration

Tailwind classes are configured for React Native through NativeWind. The configuration includes:

- Custom color palette
- Typography scales
- Spacing system
- Responsive breakpoints

## 📱 State Management

### Authentication

```tsx
import { useAuth } from '@/shared';

function MyComponent() {
  const { user, isAuthenticated, signIn, signOut } = useAuth();
  
  // Use authentication state and methods
}
```

### Feed Management

```tsx
import { useFeed } from '@/shared';

function FeedComponent() {
  const { bytes, isLoading, refreshFeed, toggleLike } = useFeed();
  
  // Use feed state and methods
}
```

### Byte Creation

```tsx
import { useCreateByte } from '@/shared';

function ComposeComponent() {
  const { createByte, isCreating, validateByte } = useCreateByte();
  
  // Use byte creation methods
}
```

## 🔄 Migration Notes

This project was migrated from a Next.js web application to React Native. Key changes include:

### Framework Migration
- **Next.js** → **Expo with Expo Router**
- **ShadCN UI** → **Gluestack UI**
- **Tailwind CSS** → **NativeWind**
- **Lucide React** → **Lucide React Native**

### Architecture Preservation
- Maintained original page structure and navigation flow
- Preserved component hierarchy and design patterns
- Kept business logic and state management patterns
- Maintained TypeScript type safety

### Mobile Optimizations
- Touch-friendly interface elements
- Mobile-specific navigation patterns
- Responsive design for various screen sizes
- Platform-specific optimizations

## 🚀 Deployment

### Expo Application Services (EAS)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Build for production**
   ```bash
   # iOS
   eas build --platform ios
   
   # Android
   eas build --platform android
   
   # Both platforms
   eas build --platform all
   ```

### Web Deployment

The app can also be deployed as a web application:

```bash
npm run build:web
```

## 📝 TODO / Future Enhancements

- [ ] Implement actual API integration
- [ ] Add push notifications
- [ ] Implement image/media upload
- [ ] Add offline support with caching
- [ ] Implement real-time features
- [ ] Add comprehensive testing
- [ ] Performance optimizations
- [ ] Accessibility improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original FomioNext web application
- Expo team for the excellent development platform
- Gluestack UI for the component library
- NativeWind for Tailwind CSS integration
- React Native community for the ecosystem

