# Employee Management System

A modern, responsive web-based Employee Management System built with React and Vite. This application helps organizations manage employee tasks, improve productivity, and streamline team collaboration.

## 🚀 Features

### Role-Based Access Control
- **Admin**: Manage users and system settings
- **Manager**: Assign tasks and track progress
- **Employee**: View and update own tasks

### Core Functionality
- **User Management**: Add, edit, and manage user accounts
- **Task Management**: Create, assign, and track tasks with priorities
- **Progress Tracking**: Monitor task completion and performance
- **Real-time Updates**: Instant status changes and progress updates
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Task Details
- Title and Description
- Assigned To (Employee)
- Priority Levels (Low, Medium, High)
- Status Tracking (To Do, In Progress, Done)
- Deadline Management
- Progress Percentage

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Routing**: React Router DOM 7.8.0
- **Styling**: CSS3 with CSS Variables
- **Icons**: Emoji-based icons for simplicity

## 📦 Installation

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
   Navigate to `http://localhost:3000`

## 🔐 Demo Credentials

### Admin Access
- **Email**: admin@bitopark.com
- **Password**: 123456
- **Role**: Administrator

### Manager Access
- **Email**: manager@bitopark.com
- **Password**: 123456
- **Role**: Manager

### Employee Access
- **Email**: employee@bitopark.com
- **Password**: 123456
- **Role**: Employee

## 🎯 User Roles & Permissions

### 👑 Admin Dashboard
- **User Management**: Add, edit, delete users
- **System Overview**: View total users, active users, managers, employees
- **User Status Control**: Activate/deactivate user accounts
- **Department Management**: Assign users to departments

### 📊 Manager Dashboard
- **Task Creation**: Create and assign tasks to employees
- **Task Management**: Monitor task progress and completion
- **Team Overview**: View team members and their task counts
- **Progress Tracking**: Real-time task status updates

### 👤 Employee Dashboard
- **Personal Tasks**: View assigned tasks with details
- **Progress Updates**: Update task status and progress percentage
- **Performance Metrics**: Track completion rate and on-time delivery
- **Task Filtering**: Filter tasks by status (All, To Do, In Progress, Done)

## 🎨 Design Features

### Modern UI/UX
- **Gradient Backgrounds**: Beautiful gradient backgrounds throughout the app
- **Card-based Layout**: Clean, organized card layouts for content
- **Hover Effects**: Smooth hover animations and transitions
- **Color-coded Status**: Visual status indicators with appropriate colors
- **Responsive Grid**: Adaptive grid layouts for different screen sizes

### Interactive Elements
- **Progress Bars**: Visual progress tracking with sliders
- **Status Dropdowns**: Easy status updates with styled dropdowns
- **Filter Buttons**: Quick task filtering with active state indicators
- **Modal Dialogs**: Clean modal interfaces for forms and confirmations

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with side-by-side layouts
- **Tablet**: Adapted layouts with optimized touch interactions
- **Mobile**: Single-column layouts with touch-friendly buttons

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
employee-management-system/
├── src/
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   │   ├── Login.jsx       # Login page with role selection
│   │   ├── AdminDashboard.jsx
│   │   ├── ManagerDashboard.jsx
│   │   └── EmployeeDashboard.jsx
│   ├── styles/             # CSS files
│   │   ├── index.css       # Global styles and variables
│   │   ├── App.css         # App-specific styles
│   │   ├── Login.css       # Login page styles
│   │   ├── AdminDashboard.css
│   │   ├── ManagerDashboard.css
│   │   └── EmployeeDashboard.css
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies and scripts
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

### Deploy to Netlify
1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify
3. Or connect your GitHub repository for automatic deployments

## 🔮 Future Enhancements

- [ ] **Real-time Notifications**: Email and in-app notifications
- [ ] **File Attachments**: Support for task-related files
- [ ] **Time Tracking**: Built-in time tracking for tasks
- [ ] **Reporting**: Advanced analytics and reporting features
- [ ] **Calendar Integration**: Calendar view for tasks and deadlines
- [ ] **API Integration**: Backend API for persistent data storage
- [ ] **Dark Mode**: Toggle between light and dark themes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developed By

**BITOPARK TECHNOLOGIES**

---

**Note**: This is a demo application with mock data. For production use, implement proper authentication, database integration, and security measures.