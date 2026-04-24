# ClientFlow CRM - Enterprise Client Management Platform

ClientFlow CRM is a high-performance, full-stack MERN application designed for modern agencies and freelancers to manage clients, projects, and billing with ease. It features a premium dark-mode aesthetic, robust role-based access control, and integrated financial tools.

## 🚀 Key Features

### 1. Advanced Analytics Dashboard
- **Real-time Insights**: Track revenue growth, project velocity, and operational efficiency through interactive charts.
- **Data Visualization**: Integrated Chart.js for Line, Bar, and Pie charts reflecting business health.
- **Top Entities**: Automatically identify your most active clients and highest-revenue periods.

### 2. Project & Task Management
- **Full Lifecycle Tracking**: Manage projects from "Active" to "Completed" with budget and deadline tracking.
- **Granular Tasks**: Assign tasks with priority levels (Low, Medium, High) and status tracking.
- **Visual Scheduling**: Integrated FullCalendar for a bird's-eye view of all project deadlines.

### 3. Financial & Billing Suite
- **Invoice Generation**: Create professional invoices with automated tax and subtotal calculations.
- **PDF Export**: Generate and download high-quality PDF invoices using `jspdf` and `jspdf-autotable`.
- **Stripe Integration**: Secure, PCI-compliant payment processing using Stripe Elements for direct client payments.

### 4. Role-Based Access Control (RBAC)
- **Multi-Level Permissions**: Distinct "Admin" and "Member" roles.
- **Data Security**: Admins have full control, while Members are restricted to viewing and managing assigned records.
- **UI Adaptation**: The interface dynamically adjusts (hides/shows actions) based on the user's role.

### 5. Secure File & Asset Management
- **Cloud Storage**: Integrated with Cloudinary for secure file and profile picture hosting.
- **Contextual Uploads**: Upload documents directly to specific projects or clients.

### 6. Premium User Experience
- **Modern UI**: Tailored dark-mode theme with glassmorphism effects and custom scrollbars.
- **Fixed Navigation**: Sticky sidebar and header for seamless navigation regardless of content length.
- **Session Integrity**: Real-time token verification ensures secure sessions on every page load.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **State Management**: Context API
- **Charts**: Chart.js & react-chartjs-2
- **Calendar**: FullCalendar
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **File Handling**: Multer & Multer-Storage-Cloudinary
- **Payments**: Stripe API

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd ClientFlow-CRM
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm run build
```

### 3. Environment Configuration
Create a `.env` file in the `server/` directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

Create a `.env` file in the `client/` directory and add:
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Run the Application
```bash
# Run both client and server in development mode
npm run dev
```

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
