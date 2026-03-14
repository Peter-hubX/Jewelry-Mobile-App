# Michiel Jewelry App

A premium mobile application built with React Native (Expo) for Michiel Jewelry. The app connects to the Next.js backend to display dynamic gold prices, an extensive catalog of jewelry, and facilitates customer inquiries directly via WhatsApp.

---

## 📱 Tech Stack
* **Framework:** React Native / Expo
* **Routing:** Expo Router (`app/` directory)
* **Data Fetching:** `@tanstack/react-query`
* **Animations:** `react-native-reanimated`
* **Styling:** Custom StyleSheet / Constants
* **Backend:** Next.js API Routes (Prisma/SQLite)

---

## 🚀 Getting Started (Local Development)

Because this mobile app relies on the Next.js backend for its data, **both the frontend and backend must be running simultaneously.**

### 1. Start the Backend (Next.js)
Open a terminal and navigate to the project's root folder (`Jewelry-Shop-main`):
```bash
# Install dependencies (if not done already)
npm install

# Start the Next.js development server
npm run dev
```
*Note: Make sure your computer is connected to the internet to fetch live gold prices, and ensure port 3000 is open!*

### 2. Configure Environment Variables
In the mobile app folder (`michiel-jewelry-app`), ensure your `.env` file points to your backend. Since you are dealing with a physical mobile device or simulator, **do not use `localhost`** (as it refers to the phone itself contextually). You must use your computer's local local IP address (e.g., `192.168.x.x` or `172.x.x.x`).

Create or edit `michiel-jewelry-app/.env`:
```env
# Example IP Address configuration
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:3000
```
*Tip: On Windows, use `ipconfig` to find your IPv4 address.*

### 3. Start the Frontend (Expo Mobile App)
Open a **new** terminal window and navigate to the mobile app folder:
```bash
cd michiel-jewelry-app

# Install dependencies (if not done already)
npm install

# Start the Expo development server and clear cache
npx expo start --clear
```

### 4. View the App
* **iOS:** Install the **Expo Go** app from the App Store. Open your iPhone's camera and scan the QR code generated in the Expo terminal.
* **Android:** Install the **Expo Go** app from the Google Play Store. Scan the QR code using the Expo Go app.

---

## 🗺️ Roadmap to App Stores (Production Deployment)

To ship this application to actual users on iOS and Android, follow this deployment roadmap.

### Phase 1: Preparation
1. **Change the API URL:** Before building the final app, change `EXPO_PUBLIC_API_URL` in your `.env` file from your local IP address to your real, deployed domain name (e.g., `https://your-domain.com`).
2. **App Icons & Splash Screen:** Place a clean `1024x1024` icon at `assets/images/icon.png` and a splash screen image at `assets/images/splash.png`.
3. **Configure `app.json`:** Update your `app.json` configuration file with your specific application IDs, names, and versions:
   ```json
   {
     "expo": {
       "name": "Michiel Jewelry",
       "slug": "michiel-jewelry-app",
       "version": "1.0.0",
       "ios": {
         "bundleIdentifier": "com.michiel.jewelry"
       },
       "android": {
         "package": "com.michiel.jewelry"
       }
     }
   }
   ```

### Phase 2: Setup Expo Application Services (EAS)
EAS is Expo's cloud service that compiles your Javascript code into native app packages without requiring a local Mac environment to build iOS apps.

1. Install EAS CLI globally via npm:
   ```bash
   npm install -g eas-cli
   ```
2. Log into your Expo account:
   ```bash
   eas login
   ```
3. Initialize the EAS build system (this will generate an `eas.json` file in your project):
   ```bash
   eas build:configure
   ```

### Phase 3: Build for Android (Google Play Store)
1. Ensure your Google Play Developer Account ($25 one-time fee) is fully setup.
2. Run the EAS build command for Android:
   ```bash
   eas build --platform android
   ```
3. Expo will prompt you to generate a new Android Keystore (say **yes**).
4. Once the cloud build completes, you will receive an `.aab` (Android App Bundle) file.
5. Upload this `.aab` file to your Google Play Console, complete your store listing (screenshots, descriptions, privacy policy), and submit for review!

### Phase 4: Build for iOS (Apple App Store)
1. Ensure your Apple Developer Account ($99/year) is fully setup.
2. Run the EAS build command for iOS:
   ```bash
   eas build --platform ios
   ```
3. Log in with your Apple ID when prompted by Expo. Expo will automatically handle creating your Distribution Certificates and Provisioning Profiles!
4. Once the cloud build completes, you will receive an `.ipa` file.
5. Use EAS Submit to send the file directly to App Store Connect:
   ```bash
   eas submit -p ios
   ```
6. From App Store Connect, configure your screenshots, descriptions, and request a review.

---

## 🛠️ Important Notes & Maintenance
- **Contact Details:** Phone numbers, Facebook URLs, and Location details are stored centrally in `constants/Config.ts`.
- **Gold Formatting:** Prices fetch automatically and default correctly; they have automatic fallbacks setup if the internet or Gold APIs suffer timeouts.
- **Async Storage:** Product data requests are currently configured to sync with caching utilities for local app speed.
