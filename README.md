# FindFreebie 🍎

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Appwrite](https://img.shields.io/badge/Appwrite-F02E65?style=for-the-badge&logo=appwrite&logoColor=white)](https://appwrite.io/)

FindFreebie is a mobile application that connects people who want to give away free food and items with those who are looking for them. The app helps reduce waste, save money, and build stronger communities by making it easy to share resources locally.

## 🌟 Features

- **User Authentication**: Secure sign-in with Google and Apple
- **Real-time Feed**: Browse nearby free items with filters
- **Interactive Map**: Visual representation of available items
- **Item Posting**: Create listings with photos, descriptions, and categories
- **In-app Messaging**: Chat with other users about items
- **Push Notifications**: Get alerts for new items and messages
- **Location-based Services**: Find items near you

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Appwrite instance (self-hosted or cloud)
- iOS Simulator / Android Emulator or physical device with Expo Go

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/FindFreeFood.git
   cd FindFreeFood
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Appwrite configuration

4. Start the development server:
   ```bash
   npx expo start
   ```

## 📱 Project Structure

```
FindFreeFood/
├── app/                  # Main app navigation and screens
├── assets/              # Static assets (images, fonts, etc.)
├── components/          # Reusable UI components
├── constants/           # App constants and theme
├── lib/                 # Appwrite client and data layer
├── providers/           # React context providers
├── store/               # State management
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 🔧 Development

### Scripts

- `start`: Start the Expo development server
- `android`: Run on Android device/emulator
- `ios`: Run on iOS simulator
- `web`: Run in web browser
- `lint`: Run ESLint
- `test`: Run tests

### Code Style

This project uses:
- TypeScript for type safety
- ESLint and Prettier for code formatting
- React Native Paper for UI components
- React Navigation for routing

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Documentation

For detailed documentation, please see the [docs](./docs/) directory:

- [Architecture](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Component Library](./docs/COMPONENTS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Testing Guide](./docs/TESTING.md)

## 🙏 Acknowledgments

- [Expo](https://expo.dev/)
- [Appwrite](https://appwrite.io/)
- [React Native Paper](https://reactnativepaper.com/)
- [React Navigation](https://reactnavigation.org/)
