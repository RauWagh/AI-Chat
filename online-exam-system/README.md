# Online Examination System - Frontend

A comprehensive, responsive frontend interface for an online examination system with role-based access control for students, teachers, administrators, and proctors.

## 🚀 Features

### General Features
- **Unified Login System**: Single login page with role selection
- **Role-Based Access Control**: Separate dashboards for different user types
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, intuitive interface with role-specific color schemes
- **Real-time Updates**: Live data synchronization and notifications
- **Cross-browser Compatibility**: Works on all modern browsers

### Student Portal
- **Exam Management**: View available exams with details (subject, time, duration)
- **Exam Participation**: Start exams with active/inactive state management
- **Results Dashboard**: View completed exam results with detailed feedback
- **Performance Analytics**: Track progress and performance metrics
- **Clean Interface**: Minimalistic design to reduce distractions during exams

### Teacher Portal
- **Exam Creation**: Comprehensive form for creating new exams
- **Exam Management**: Edit, delete, and manage existing exams
- **Student Monitoring**: View and monitor student submissions and performance
- **Grading System**: Grade student submissions with feedback
- **Analytics Dashboard**: Performance metrics and charts for class analysis

### Admin Portal
- **User Management**: Add, edit, delete users across all roles
- **System Oversight**: Monitor platform operations and settings
- **Advanced Search**: Filter and search users by role, department, status
- **Reporting System**: Generate comprehensive system reports
- **Security Monitoring**: Track user activities and system health

### Proctor Portal
- **Live Monitoring**: Real-time webcam feeds of active students
- **Activity Flagging**: Flag suspicious activities during exams
- **Exam Controls**: Start/stop monitoring, enable lockdown mode
- **Activity Logs**: Real-time updates of exam activities
- **Fullscreen Mode**: Expand individual student feeds for detailed monitoring

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with Vite
- **Routing**: React Router DOM v6
- **Styling**: External CSS files with CSS Custom Properties
- **Icons**: React Icons (Font Awesome)
- **HTTP Client**: Axios for API communications
- **State Management**: React Context API with useReducer
- **Authentication**: JWT-based with localStorage persistence

## 📁 Project Structure

```
online-exam-system/
├── public/
│   └── vite.svg
├── src/
│   ├── components/          # Reusable UI components
│   │   └── Login.jsx       # Unified login component
│   ├── pages/              # Main dashboard pages
│   │   ├── StudentDashboard.jsx
│   │   ├── TeacherDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ProctorDashboard.jsx
│   ├── context/            # React Context providers
│   │   └── AuthContext.jsx # Authentication state management
│   ├── services/           # API integration layer
│   │   └── api.js          # API service functions
│   ├── styles/             # External CSS files
│   │   ├── global.css      # Global styles and variables
│   │   ├── login.css       # Login page styles
│   │   ├── dashboard.css   # Dashboard component styles
│   │   └── proctor.css     # Proctor-specific styles
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main application component
│   └── main.jsx            # Application entry point
├── package.json
└── vite.config.js
```

## 🎨 Design System

### Color Scheme
- **Student**: Blue theme (#2563eb, #dbeafe, #1d4ed8)
- **Teacher**: Green theme (#059669, #d1fae5, #047857)
- **Admin**: Red theme (#dc2626, #fee2e2, #b91c1c)
- **Proctor**: Purple theme (#7c3aed, #ede9fe, #6d28d9)

### Typography
- **Primary Font**: Inter, system-ui, -apple-system, sans-serif
- **Monospace**: 'Courier New' for timers and code
- **Font Sizes**: Responsive scale from 0.875rem to 1.875rem

### Layout Principles
- **Grid System**: CSS Grid with responsive breakpoints
- **Spacing**: Consistent spacing scale (0.25rem to 3rem)
- **Border Radius**: Unified radius system (0.25rem to 0.75rem)
- **Shadows**: Layered shadow system for depth perception

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-exam-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🌐 API Integration

The application is designed to work with a RESTful backend API. Currently uses mock data for development:

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh

### Student Endpoints
- `GET /api/student/exams` - Get available exams
- `GET /api/student/results` - Get exam results
- `POST /api/student/exam/start` - Start an exam
- `POST /api/student/exam/submit` - Submit exam answers

### Teacher Endpoints
- `GET /api/teacher/exams` - Get teacher's exams
- `POST /api/teacher/exam` - Create new exam
- `PUT /api/teacher/exam/:id` - Update exam
- `DELETE /api/teacher/exam/:id` - Delete exam
- `GET /api/teacher/submissions/:examId` - Get exam submissions

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `POST /api/admin/user` - Create new user
- `PUT /api/admin/user/:id` - Update user
- `DELETE /api/admin/user/:id` - Delete user
- `GET /api/admin/stats` - Get system statistics
- `POST /api/admin/report` - Generate reports

### Proctor Endpoints
- `GET /api/proctor/exams/active` - Get active exams
- `GET /api/proctor/exam/:id/students` - Get exam students
- `POST /api/proctor/flag` - Flag suspicious activity
- `GET /api/proctor/exam/:id/logs` - Get activity logs

## 🔐 Authentication Flow

1. **Role Selection**: User selects their role (Student/Teacher/Admin/Proctor)
2. **Credential Entry**: User enters email and password
3. **Authentication**: System validates credentials against backend
4. **Token Storage**: JWT token stored in localStorage
5. **Dashboard Redirect**: User redirected to role-specific dashboard
6. **Session Persistence**: Login state maintained across browser sessions

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 1024px - Full featured layout
- **Tablet**: 768px - 1024px - Adapted navigation and grid
- **Mobile**: < 768px - Single column layout, collapsible navigation

### Mobile Optimizations
- Touch-friendly button sizes (minimum 44px)
- Simplified navigation with hamburger menu
- Optimized form layouts for small screens
- Responsive data tables with horizontal scroll
- Adjusted font sizes and spacing for readability

## 🎯 User Experience Features

### Loading States
- Skeleton screens during data loading
- Progress indicators for long operations
- Smooth transitions between states

### Error Handling
- User-friendly error messages
- Automatic retry mechanisms
- Graceful degradation for offline scenarios

### Accessibility
- WCAG 2.1 compliant color contrast ratios
- Keyboard navigation support
- Screen reader friendly markup
- Focus management for modals and forms

## 🔒 Security Considerations

### Client-Side Security
- JWT token expiration handling
- Automatic logout on token expiry
- Role-based route protection
- Input validation and sanitization

### Best Practices
- No sensitive data in localStorage
- HTTPS enforcement for production
- Content Security Policy headers
- XSS protection through React's built-in sanitization

## 🚀 Deployment

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=Online Exam System
```

### Build Process
```bash
npm run build
```

The `dist/` folder contains the production-ready files that can be deployed to any static hosting service.

### Hosting Options
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based automatic deployments
- **AWS S3 + CloudFront**: Enterprise-grade hosting
- **Traditional Web Servers**: Apache, Nginx

## 🧪 Testing

### Test Coverage Areas
- Component rendering and interactions
- Authentication flow testing
- API integration testing
- Responsive design validation
- Cross-browser compatibility testing

### Testing Commands
```bash
npm run test          # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🔄 State Management

### Context Providers
- **AuthContext**: Manages user authentication state
- **ThemeContext**: Handles role-based theming
- **NotificationContext**: Manages system notifications

### Data Flow
1. Components consume context through custom hooks
2. Actions dispatched through reducer functions
3. State updates trigger re-renders
4. Persistent data stored in localStorage

## 📊 Performance Optimizations

### Code Splitting
- Route-based code splitting for faster initial load
- Dynamic imports for heavy components
- Lazy loading for non-critical features

### Asset Optimization
- Image compression and lazy loading
- CSS bundling and minification
- Tree shaking for unused code elimination

### Caching Strategies
- API response caching
- Asset caching with service workers
- Browser caching headers

## 🛠️ Development Guidelines

### Code Style
- ESLint configuration for consistent code quality
- Prettier for code formatting
- Consistent naming conventions
- Component-based architecture

### Git Workflow
- Feature branch development
- Pull request reviews
- Conventional commit messages
- Automated testing on CI/CD

## 📈 Future Enhancements

### Planned Features
- Real-time chat support
- Advanced analytics dashboard
- Mobile application
- Offline exam capabilities
- Multi-language support
- Advanced proctoring features (AI-based)

### Technical Improvements
- Progressive Web App (PWA) capabilities
- Advanced caching mechanisms
- Performance monitoring integration
- Automated accessibility testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**Built with ❤️ using React and modern web technologies**
