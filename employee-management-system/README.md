# Employee Management System

A modern, responsive web-based Employee Management System built with React and Vite. This application helps organizations manage employee tasks, improve productivity, and streamline team collaboration.

## 🚀 Features

### 🔐 Authentication & Authorization
- **Role-based Access Control**: Admin, Manager, and Employee roles with different permissions
- **Secure Login System**: Username/password authentication with session management
- **Demo Accounts**: Pre-configured accounts for testing different user roles

### 📋 Task Management
- **Create & Assign Tasks**: Admins and managers can create tasks and assign them to team members
- **Task Status Tracking**: Track task progress (To Do, In Progress, Done)
- **Priority Levels**: Set task priorities (Low, Medium, High)
- **Deadline Management**: Set and track task deadlines with overdue alerts
- **Search & Filtering**: Advanced filtering by status, priority, assignee, and search functionality

### 👥 User Management
- **Role-based User Viewing**: View team members based on your role permissions
- **User Profiles**: Manage personal information and account settings
- **Avatar Support**: Visual user identification with avatar images

### 🔔 Notification System
- **Real-time Notifications**: Get notified about task updates and deadlines
- **Deadline Alerts**: Automatic notifications for upcoming and overdue tasks
- **Success/Error Messages**: Clear feedback for user actions

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Beautiful Interface**: Modern, clean design with smooth animations
- **Accessibility**: Built with accessibility best practices in mind
- **Dark Mode Support**: Automatic dark mode detection

### 📊 Dashboard & Analytics
- **Task Statistics**: Visual overview of task distribution and completion rates
- **Personal Dashboard**: Personalized view of assigned tasks and deadlines
- **Recent Activity**: Track recent task updates and changes

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM
- **Styling**: Pure CSS with CSS Variables
- **State Management**: React Context API
- **Icons**: Emoji-based icons for better cross-platform compatibility
- **Build Tool**: Vite for fast development and optimized builds

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd employee-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 👤 Demo Accounts

The application comes with pre-configured demo accounts for testing:

| Role | Username | Password | Permissions |
|------|----------|----------|-------------|
| Admin | admin | admin123 | Full access to all features |
| Manager | manager | manager123 | Can create tasks, manage employees |
| Employee | employee | employee123 | Can view and update assigned tasks |

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Login.jsx        # Authentication
│   ├── Navbar.jsx       # Navigation bar
│   ├── TaskManagement.jsx # Task CRUD operations
│   ├── UserManagement.jsx # User management
│   └── Profile.jsx      # User profile
├── context/             # React Context providers
│   ├── AuthContext.jsx  # Authentication state
│   ├── TaskContext.jsx  # Task management state
│   └── NotificationContext.jsx # Notification system
├── styles/              # CSS stylesheets
│   ├── App.css         # Global styles
│   ├── Login.css       # Login page styles
│   ├── Navbar.css      # Navigation styles
│   ├── Dashboard.css   # Dashboard styles
│   ├── TaskManagement.css # Task management styles
│   ├── UserManagement.css # User management styles
│   └── Profile.css     # Profile page styles
└── utils/              # Utility functions
```

## 🔧 Key Features Breakdown

### Role-Based Permissions

**Admin Users Can:**
- View all tasks and users
- Create, edit, and delete any task
- Assign tasks to any user
- Access user management features

**Manager Users Can:**
- View tasks assigned by them and employee tasks
- Create and assign tasks to employees
- Edit tasks they created
- View employee profiles

**Employee Users Can:**
- View tasks assigned to them
- Update status of their assigned tasks
- Edit their own profile
- Limited edit capabilities on assigned tasks

### Task Management Workflow

1. **Creation**: Admins/Managers create tasks with title, description, assignee, priority, and deadline
2. **Assignment**: Tasks are assigned to specific team members
3. **Tracking**: Assignees can update task status and progress
4. **Monitoring**: Managers track completion and performance
5. **Completion**: Tasks move through statuses until completion

### Notification System

- **Deadline Alerts**: Automatic notifications 1 day before due date
- **Overdue Warnings**: Alerts for tasks past their deadline
- **Status Updates**: Notifications when task status changes
- **Success Messages**: Confirmation for successful actions

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Adapted layout with optimized spacing
- **Mobile**: Mobile-first design with hamburger menu and touch-friendly interactions

## 🎨 Customization

### Theming
The application uses CSS variables for easy theming. Key variables are defined in `src/styles/App.css`:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  /* ... more variables */
}
```

### Adding New Features
1. Create new components in `src/components/`
2. Add corresponding CSS files in `src/styles/`
3. Update routing in `src/App.jsx`
4. Add context providers if needed for state management

## 🔄 State Management

The application uses React Context API for state management:

- **AuthContext**: Manages user authentication and session
- **TaskContext**: Handles all task-related operations
- **NotificationContext**: Manages notification system

## 🚧 Future Enhancements

- [ ] Real backend integration
- [ ] Advanced user management (add/edit/delete users)
- [ ] File attachment support for tasks
- [ ] Time tracking functionality
- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Team chat functionality
- [ ] Advanced search with filters
- [ ] Export functionality (PDF/Excel)
- [ ] Multi-language support
- [ ] Two-factor authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Icons and emojis for visual elements
- Modern CSS techniques for responsive design
- React Router for navigation
- Context API for state management

---

**Note**: This is a demo application for showcasing employee management features. For production use, implement proper backend authentication, database integration, and security measures.
