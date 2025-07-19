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

## Web3 Potential & Future Features
HeartSync is designed with Web3 potential in mind. In the future, the app aims to include exciting blockchain-based features such as:
- **Send Coins**: Users will be able to send digital coins or tokens to each other as gifts or tips.
- **Digital Gifts**: Send unique digital gifts or collectibles to matches and friends.
- **Blockchain-Based Profiles**: Secure, verifiable user profiles and achievements on the blockchain.
- **NFT Avatars & Badges**: Use NFT-based profile pictures and earn blockchain badges for achievements.
- **On-Chain Matchmaking**: Transparent and secure matching logic powered by smart contracts.
- **Web3 Wallet Integration**: Connect your crypto wallet to manage assets and interact with Web3 features.

These features will make HeartSync even more interactive, rewarding, and secure for all users.

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
   git clone https://github.com/adamstosho/HeartSyc.git
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

## Preview of the App Interface (SCREENSHOTS)

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-2025-07-19-11_49_13.png)
Here is the glimpse of the app landing page

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-register-2025-07-19-11_51_25.png)
Here is the snaptshot of the registration page of the app

![screenshot](/frontend/public/screenshots/screencapture-heartsync-gamma-vercel-app-chat-687b548eeaa67f24478cfe85-2025-07-19-11_57_44.png)
This shows chat room of the app, where the matched users can hold a conversation (only for matched)


![screenshot](/frontend/public/screenshots/screencapture-heartsync-gamma-vercel-app-chat-687b548eeaa67f24478cfe85-2025-07-19-11_58_14.png)
Here is the reporting section located in the chat room, where users can report for admin to take action

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-admin-2025-07-19-11_58_59.png)
This shows how the admin can takwe actions on the report cases

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-admin-2025-07-19-11_56_26.png)
This is the admin dashboard 

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-admin-2025-07-19-11_56_43.png)
This is the admin panel where the admin can take banning action or deletion of user's account

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-admin-2025-07-19-11_57_01.png)
This is the admin panel where the admin can choose to verify the users, because it is only the verified users that can featured on the app

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-admin-2025-07-19-11_58_44.png)
This shows where the admin see the reports from the users

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-chat-2025-07-19-11_54_35.png)
Chat page

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-chat-687b548eeaa67f24478cfe85-2025-07-19-11_54_22.png)
Main chat room interface between matched users

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-dashboard-2025-07-19-11_52_09.png)
New registered users dashboard, awaiting verfification

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-dashboard-2025-07-19-11_52_52.png)
Registered user's dashboard showing accurate stats and suggesgted mtch 

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-dashboard-2025-07-19-11_56_09.png)
This shows where the admin can perform logout actions

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-discover-2025-07-19-11_53_07.png)
This is where verfified users can find match

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-matches-2025-07-19-11_53_55.png)
Match suggestions tab

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-matches-2025-07-19-11_54_06.png)
Matched users tab and chatting navigation button

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-profile-2025-07-19-11_54_48.png)
This is where the user's profile page

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-profile-687b53d8eaa67f24478cfe03-2025-07-19-11_53_37.png)
This page is shown when the user click to view the potential match profile

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-profile-edit-2025-07-19-11_55_12.png)
This is the edit profile page

![screenshot](/frontend/public/screenshots/screencapture-localhost-3003-profile-edit-2025-07-19-11_55_32.png)
User logout toggle 






## Deployment
- The app is ready for deployment on Vercel (frontend) and Render/Heroku (backend).
- Set environment variables in your deployment dashboard as shown above.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contact
For questions, support, or feedback, please contact the project maintainer at [omoridoh111@gmail.com]. 