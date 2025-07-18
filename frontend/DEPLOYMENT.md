# Frontend Deployment Guide

## Issues Fixed

1. **React Context Error**: Removed the `"use client"` directive from `AuthContext.jsx` that was causing the `createContext` error
2. **Missing Assets**: Created `heart-icon.svg` and `placeholder.svg` in the `public` directory
3. **Build Configuration**: Updated `vite.config.js` to fix chunk splitting and added global definition
4. **Production Server**: Added Express server for serving the built app

## Environment Variables

Create a `.env` file in the frontend directory with:

```env
# API Configuration
VITE_API_BASE_URL=https://heartsync-0boj.onrender.com/api

# Cloudinary Configuration (for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

## Deployment Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the app**:
   ```bash
   npm run build
   ```

3. **Start production server**:
   ```bash
   npm start
   ```

## Development

For development, use:
```bash
npm run dev
```

The app will run on port 3003.

## Build Output

The build creates optimized files in the `dist/` directory:
- `index.html` - Main HTML file
- `assets/` - Optimized CSS and JavaScript bundles
- `heart-icon.svg` - Favicon
- `placeholder.svg` - Default user avatar

## Troubleshooting

- If you see "Cannot read properties of undefined (reading 'createContext')", ensure the `"use client"` directive is removed from `AuthContext.jsx`
- If assets fail to load, check that `heart-icon.svg` and `placeholder.svg` exist in the `public/` directory
- For API connection issues, verify `VITE_API_BASE_URL` is set correctly 