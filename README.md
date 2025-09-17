# CRUD Task Manager

An offline-first React Native application built with RxDB and SQLite, featuring seamless CouchDB synchronization. This app allows users to manage businesses and articles with full offline capabilities and automatic synchronization when back online.

## 📹 Demo Video

[![App Demo](https://img.youtube.com/vi/J4NZeJ9fJe8/maxresdefault.jpg)](https://youtube.com/shorts/J4NZeJ9fJe8?si=YpA-0GgPemDOHbyR)

*Click the image above to watch the demo video on YouTube*

## ✨ Features

- **Offline-First Architecture**: Work seamlessly without an internet connection
- **Real-time Sync**: Automatic data synchronization when online
- **CRUD Operations**: Full Create, Read, Update, and Delete functionality
- **Multi-Platform**: Works on both Android and iOS
- **Persistent Storage**: SQLite for reliable local data storage
- **Reactive Programming**: Built with RxDB for responsive UI updates

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or later)
- npm or Yarn
- React Native development environment
- Android Studio / Xcode (for mobile development)
- Docker (for local CouchDB instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crudTask
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   ```bash
   cp src/env.example .env
   ```
   Update the `.env` file with your CouchDB credentials.

### Running the Development Server

1. **Start Metro bundler**
   ```bash
   npm start
   # or
   yarn start
   ```

2. **Run on Android**
   ```bash
   npm run android
   # or
   yarn android
   ```

3. **Run on iOS**
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   # or
   yarn ios
   ```

## 🛠 Development Setup

### CouchDB Setup (Local Development)

1. **Start CouchDB using Docker**
   ```bash
   docker run -d --name couchdb -p 5984:5984 \
     -e COUCHDB_USER=admin \
     -e COUCHDB_PASSWORD=password \
     couchdb:latest
   ```

2. **Configure CouchDB**
   - Access Fauxton UI at http://localhost:5984/_utils
   - Log in with the credentials set above (admin/password by default)
   - Enable CORS in the configuration
   - Create the required databases: `businesses` and `articles`

## 📦 Building for Production

### Android APK
```bash
cd android && ./gradlew assembleRelease
# The APK will be available at: android/app/build/outputs/apk/release/app-release.apk
```

## 📲 Download APK

You can download the latest stable APK from our GitHub Releases page:

[![Download APK](https://img.shields.io/badge/Download-APK-brightgreen?style=for-the-badge&logo=android)](https://github.com/SuhelIndiIt/crud-task-localDB/releases/latest/download/app-release.apk)

### How to install the APK:
1. Download the APK file from the link above
2. On your Android device, go to Settings > Security
3. Enable "Unknown sources" to allow installation of apps from unknown sources
4. Open the downloaded APK file and tap "Install"

### For Developers: Creating a New Release
1. Build a release APK:
   ```bash
   cd android && ./gradlew assembleRelease
   ```
2. Create a new GitHub Release and upload the APK file from:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```
3. Tag the release with a version number (e.g., v1.0.0)
4. The APK will then be available for download at:
   ```
   https://github.com/SuhelIndiIt/crud-task-localDB/releases/latest/download/app-release.apk
   ```

### iOS Archive
1. Open the Xcode workspace:
   ```bash
   cd ios && open crudTask.xcworkspace
   ```
2. Select Product > Archive in Xcode

## 🔄 Data Synchronization
- The app automatically syncs with the CouchDB server when online
- All changes made offline are queued and synced when connectivity is restored
- Conflict resolution is handled automatically by CouchDB

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
