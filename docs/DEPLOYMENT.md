# Deployment Guide

This guide provides instructions for deploying the FindFreebie application to various platforms.

## Prerequisites

- Node.js v16 or later
- npm or yarn
- Appwrite instance (self-hosted or cloud)
- Expo account (for app distribution)
- Apple Developer Account (for iOS)
- Google Play Developer Account (for Android)

## Environment Setup

1. Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   EXPO_PUBLIC_APPWRITE_COLLECTION_ITEMS=items_collection_id
   EXPO_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

## Building for Development

### iOS Simulator
```bash
npx expo start --ios
```

### Android Emulator
```bash
npx expo start --android
```

### Web
```bash
npx expo start --web
```

## Building for Production

### 1. Update App Configuration

Update `app.json` with your app's information:
```json
{
  "expo": {
    "name": "FindFreebie",
    "slug": "findfreebie",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.findfreebie"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.yourcompany.findfreebie"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### 2. Build for iOS

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account:
   ```bash
   eas login
   ```

3. Configure the build:
   ```bash
   eas build:configure
   ```

4. Build the app:
   ```bash
   eas build --platform ios --profile production
   ```

### 3. Build for Android

1. Run the build command:
   ```bash
   eas build --platform android --profile production
   ```

2. Upload the APK to Google Play Console

### 4. Deploy to App Stores

#### iOS App Store
1. Archive the app in Xcode
2. Upload to App Store Connect
3. Submit for review

#### Google Play Store
1. Create a new release in Google Play Console
2. Upload the AAB file
3. Roll out to production

## Continuous Integration/Deployment (CI/CD)

### GitHub Actions

1. Create a `.github/workflows/build.yml` file:
   ```yaml
   name: Build and Deploy
   
   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]
   
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '16.x'
         - run: npm ci
         - run: npx expo install
         - run: npx expo build:web
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_APPWRITE_ENDPOINT` | Appwrite API endpoint | Yes |
| `EXPO_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite project ID | Yes |
| `EXPO_PUBLIC_APPWRITE_DATABASE_ID` | Appwrite database ID | Yes |
| `EXPO_PUBLIC_APPWRITE_COLLECTION_ITEMS` | Items collection ID | Yes |
| `EXPO_PUBLIC_APPWRITE_BUCKET_ID` | Storage bucket ID for images | Yes |

## Monitoring and Analytics

Set up the following for production monitoring:

1. **Error Tracking**: Sentry or Firebase Crashlytics
2. **Analytics**: Google Analytics or Mixpanel
3. **Performance**: React Native Performance Monitoring

## Backup and Recovery

### Database Backups

1. Set up automated backups in Appwrite
2. Export data regularly using Appwrite's export feature
3. Store backups in a secure, versioned location

### Media Storage

1. Configure CORS for your storage bucket
2. Set up lifecycle policies for old files
3. Implement backup for important media

## Scaling Considerations

1. **Database**: Upgrade Appwrite instance as needed
2. **Storage**: Use CDN for media delivery
3. **Caching**: Implement client-side caching
4. **Load Balancing**: Set up multiple Appwrite instances if needed

## Security Best Practices

1. Keep dependencies updated
2. Use HTTPS for all API calls
3. Implement proper authentication and authorization
4. Regular security audits
5. Follow OWASP Mobile Top 10 guidelines

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version
   - Clear npm cache
   - Update Expo CLI

2. **Runtime Errors**
   - Check network connectivity
   - Verify Appwrite service status
   - Review logs using `expo logs`

3. **Performance Issues**
   - Optimize images
   - Implement code splitting
   - Use React.memo for expensive renders

## Rollback Plan

1. Keep previous versions of the app
2. Document rollback procedures
3. Test rollback process regularly
