# HeartSync Matchmaking Platform

## Introduction
HeartSync is a culturally-aware matchmaking platform designed to help people in Nigeria find their perfect match for long-term relationships and marriage. The app makes it easy to connect with others who share your values, interests, and preferences.

## Problem Statement
Finding a compatible life partner can be difficult, especially when you want to consider important factors like age, tribe, religion, and personal values. HeartSync solves this problem by providing a safe, easy-to-use platform that matches users based on their preferences and helps them communicate securely.

## Main Features
- **User Registration & Login**: Create an account, log in securely, and manage your profile.
- **Profile Management**: Add your details, upload a profile photo, and set your preferences (age, tribe, religion, etc.).
- **Match Suggestions**: See a list of users who match your preferences in the Suggestions tab.
- **Send & Receive Match Requests**: Connect with others by sending and receiving match requests.
- **Accept/Reject Requests**: Accept or reject match requests from other users.
- **Matched Users & Chat**: Chat with users you have matched with in a secure, real-time chat.
- **Admin Dashboard**: Admins can manage users, verify accounts, ban/unban users, delete users, and review user reports.
- **Report & Block**: Report inappropriate users to the admin for review.
- **Profile Verification**: Verified badge for trusted users.
- **Statistics Dashboard**: See your profile views, matches, and connection rate.
- **Mobile Friendly**: Works well on both desktop and mobile devices.

## How to Use the App
1. **Register**: Sign up with your details and set your preferences.
2. **Login**: Log in to your account.
3. **Edit Profile**: Complete your profile for better match suggestions.
4. **Discover People**: Go to the Discover page to see all users and use filters to narrow your search.
5. **Matches Page**:
   - **Suggestions**: See users who match your preferences. Click "Connect" to send a match request.
   - **Received**: View match requests sent to you. Accept or reject them.
   - **Sent**: See requests you have sent to others.
   - **Matched**: View users you have matched with and start chatting.
6. **Chat**: Go to the Chat page to see all your conversations. Click on a match to chat in real time.
7. **Profile**: View your profile or others' profiles. Edit your details or upload a new photo.
8. **Admin (for admins only)**: Access the Admin Dashboard to manage users, verify, ban, or delete accounts, and review reports.
9. **Report/Block**: If you see inappropriate behavior, use the report feature to notify the admin.

## Technologies Used
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, React Query, Axios, React Router, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt, Cloudinary (for images), Socket.io (for real-time chat)
- **Other Tools**: ESLint, Prettier, PostCSS, Vercel (for deployment)

## Getting Started
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/heartsync.git
   cd heartsync
   ```
2. **Install dependencies**
   - For frontend:
     ```bash
     cd frontend
     npm install
     ```
   - For backend:
     ```bash
     cd backend
     npm install
     ```
3. **Set up environment variables**
   - Frontend: Create a `.env` file in the `frontend` folder with:
     ```env
     VITE_API_BASE_URL=https://your-backend-url/api
     VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
     ```
   - Backend: Create a `.env` file in the `backend` folder with:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```
4. **Run the app locally**
   - Start backend:
     ```bash
     cd backend
     npm start
     ```
   - Start frontend:
     ```bash
     cd frontend
     npm run dev
     ```
5. **Open your browser** and go to `http://localhost:3003` to use the app.

## Deployment
- The app is ready for deployment on Vercel (frontend) and Render/Heroku (backend).
- Set environment variables in your deployment dashboard as shown above.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contact
For questions, support, or feedback, please contact the project maintainer at [your-email@example.com]. 