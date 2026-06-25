# MaaCare Setup Guide

## Prerequisites

You need to install Node.js first, which includes npm (Node Package Manager).

### Step 1: Install Node.js

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Download the **LTS (Long Term Support)** version (recommended)
   - Choose the Windows Installer (.msi) for your system (64-bit or 32-bit)

2. **Install Node.js:**
   - Run the downloaded installer
   - Follow the installation wizard
   - **Important:** Make sure to check "Add to PATH" during installation
   - Complete the installation

3. **Verify Installation:**
   - Close and reopen your terminal/PowerShell
   - Run these commands to verify:
     ```powershell
     node --version
     npm --version
     ```
   - You should see version numbers (e.g., v18.x.x and 9.x.x)

### Step 2: Install Project Dependencies

Once Node.js is installed, run:

```powershell
npm install
```

This will install all required packages for the MaaCare app.

### Step 3: Start the Development Server

```powershell
npm start
```

Or use Expo CLI directly:

```powershell
npx expo start
```

### Step 4: Run on Your Device

- Press `a` for Android emulator
- Press `i` for iOS simulator (Mac only)
- Scan the QR code with **Expo Go** app on your phone

## Alternative: Using Yarn (Optional)

If you prefer Yarn instead of npm:

1. Install Yarn: `npm install -g yarn`
2. Install dependencies: `yarn install`
3. Start server: `yarn start`

## Troubleshooting

### If npm is still not recognized after installing Node.js:

1. **Restart your terminal/PowerShell** completely
2. **Restart your computer** (sometimes needed for PATH changes)
3. **Check PATH manually:**
   - Node.js is usually installed in: `C:\Program Files\nodejs\`
   - Make sure this path is in your system PATH environment variable

### If you get permission errors:

Run PowerShell as Administrator and try again.

### If you get network/timeout errors:

Try using a different npm registry:
```powershell
npm config set registry https://registry.npmjs.org/
```

## Need Help?

If you encounter any issues, check:
- Node.js version: Should be 16.x or higher
- npm version: Should be 8.x or higher
- Internet connection: Required for downloading packages
