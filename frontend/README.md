# HeartSync - Nigerian Matchmaking Platform

A modern, culturally-aware matchmaking platform designed specifically for Nigerians seeking meaningful relationships and marriage.

## 🌟 Features

### Core Functionality
- **User Authentication** - Secure registration and login with JWT
- **Profile Management** - Comprehensive profiles with cultural preferences
- **Smart Matching** - Algorithm-based suggestions considering cultural compatibility
- **Real-time Chat** - Messaging system for matched users
- **Admin Dashboard** - User verification, moderation, and reporting system
- **Mobile Responsive** - Optimized for all devices

### Cultural Integration
- **Nigerian States** - All 36 states + FCT supported
- **Tribal Preferences** - Major Nigerian tribes included
- **Religious Compatibility** - Christianity, Islam, Traditional beliefs
- **Language Support** - Multiple Nigerian languages
- **Cultural Values** - Marriage-focused matching

## 🚀 Tech Stack

- **Frontend**: React 18, JavaScript (ES6+)
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/heartsync-frontend.git
   cd heartsync-frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   Create a `.env` file in the root directory:
   \`\`\`env
   VITE_API_BASE_URL=http://localhost:5000/api
   \`\`\`

4. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Build for production**
   \`\`\`bash
   npm run build
   \`\`\`

## 🎨 Design System

### Color Palette
- **Heart Red** (#E63946) - Primary accent, buttons, highlights
- **Deep Navy** (#1D3557) - Main background, headers, footers
- **Soft White** (#F1FAEE) - Background, cards, surfaces
- **Sky Blue** (#457B9D) - Secondary accent, links, info
- **Mint Green** (#A8DADC) - Success, subtle backgrounds, badges
- **Sun Gold** (#FFB703) - Attention, warnings, highlights
- **Slate Gray** (#495057) - Text, icons
- **Light Gray** (#E5E5E5) - Borders, dividers
- **Charcoal** (#22223B) - Deep backgrounds, overlays

### Typography
- **Headings**: Inter, Poppins, Nunito (bold, modern)
- **Body**: Clean sans-serif fonts
- **Responsive**: Mobile-first approach

### Components
- **Buttons**: Rounded, bold, with hover states
- **Cards**: Soft white, rounded corners, subtle shadows
- **Inputs**: Rounded, light gray borders, focus rings
- **Animations**: Smooth, meaningful transitions

## 📱 Pages & Features

### Public Pages
- **Home** - Landing page with features and testimonials
- **Login** - User authentication
- **Register** - Multi-step registration process

### Protected Pages
- **Dashboard** - Overview with stats and quick actions
- **Profile** - View and manage user profile
- **Edit Profile** - Update personal information and preferences
- **Discover** - Browse and filter potential matches
- **Matches** - View suggestions, sent/received requests
- **Chat** - Message center and conversations
- **Chat Room** - Individual conversation interface

### Admin Pages
- **Admin Dashboard** - User management and moderation
- **User Verification** - Approve user profiles
- **Reports Management** - Handle user reports

## 🔧 API Integration

The frontend integrates with the HeartSync backend API:

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### User Management
- `GET /users` - Filter and search users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user account

### Matching System
- `GET /match/suggestions` - Get match suggestions
- `POST /match/request/:userId` - Send match request
- `POST /match/accept/:requestId` - Accept match request
- `POST /match/reject/:requestId` - Reject match request

### Chat System
- `GET /chat/conversations` - Get all conversations
- `GET /chat/:matchId` - Get specific chat
- `POST /chat/:matchId` - Send message

### Admin Features
- `GET /admin/users` - Get all users (admin only)
- `POST /admin/verify-user/:id` - Verify user
- `POST /admin/ban-user/:id` - Ban user
- `GET /admin/reports` - Get reports
- `POST /admin/report-user/:id` - Report user

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Protected Routes** - Role-based access control
- **Input Validation** - Client-side form validation
- **XSS Protection** - Sanitized user inputs
- **HTTPS Ready** - Production-ready security

## ♿ Accessibility

- **ARIA Labels** - Screen reader support
- **Keyboard Navigation** - Full keyboard accessibility
- **High Contrast** - Readable color combinations
- **Focus States** - Clear focus indicators
- **Semantic HTML** - Proper HTML structure

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Great experience on tablets
- **Desktop Ready** - Full desktop functionality
- **Touch Friendly** - Optimized touch interactions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables

### Manual Deployment
1. Build: `npm run build`
2. Upload `dist` folder to your web server
3. Configure web server for SPA routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Nigerian cultural consultants for authenticity
- Design inspiration from modern dating platforms
- Open source community for amazing tools
- Beta testers for valuable feedback

## 📞 Support

For support, email support@heartsync.ng or join our community Discord.

---

**Made with ❤️ in Nigeria for Nigerians finding love worldwide.**
