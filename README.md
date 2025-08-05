# 🏠 Land Sale Platform - Express + TypeScript

A comprehensive land selling platform built with Express.js, TypeScript, and MongoDB. Features role-based authentication, ad management, wishlist functionality, and admin dashboard.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Authentication Flow](#-authentication-flow)
- [Database Schema](#-database-schema)
- [Development Phases](#-development-phases)
- [Contributing](#-contributing)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Guest, Buyer, Seller, Admin)
- Secure password hashing with bcrypt
- Token refresh mechanism

### 🏡 Land Management
- Create, edit, and delete land advertisements
- Advanced filtering and search capabilities
- Image upload support
- Contact information management

### 👥 User Management
- User registration and login
- Profile management
- Wishlist functionality
- Dashboard analytics

### 🛡️ Admin Features
- User management and moderation
- Ad approval and deletion
- System analytics and reporting
- Role promotion capabilities

## 🛠️ Tech Stack

- **Backend**: Express.js + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Joi/Yup
- **File Upload**: Multer (with Cloudinary/S3 support)
- **Email**: Nodemailer/SendGrid (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 🗄️ MongoDB Setup

#### Option 1: MongoDB Atlas (Cloud - Recommended for Beginners)

1. **Create MongoDB Atlas Account**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up with Google account or email
   - Choose the free tier

2. **Create a New Project**
   - Click "New Project"
   - Name it: `LandSellingProject`
   - Click "Next" → "Create Project"

3. **Create a Cluster**
   - Click "Build a Database"
   - Choose "Shared" (Free tier)
   - Select a region near you (e.g., Asia/Singapore)
   - Leave default settings and click "Create Cluster"

4. **Create Database User**
   - After cluster creation, click "Database Access" (left sidebar)
   - Click "+ Add New Database User"
   - Username: `admin` (or your choice)
   - Password: `securepassword123` (remember this!)
   - Select "Read and write to any database"
   - Click "Add User"

5. **Allow Network Access**
   - Click "Network Access" (left sidebar)
   - Click "+ Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0)
   - Click "Confirm"

6. **Get Connection String**
   - Click "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string:
   ```
   mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password

#### Option 2: Local MongoDB Installation

1. **Install MongoDB Community Server**
   - Download from: https://www.mongodb.com/try/download/community
   - Follow installation guide for your OS
   - Start MongoDB service

2. **Connection String for Local**
   ```
   mongodb://localhost:27017/landsale
   ```
### 🔧 Full Project Flow: Image Upload & Save in MongoDB via Cloudinary
### ✅STEP 1: Setup Cloudinary
1. Go to https://cloudinary.com/ and create a free account.
2. In Cloudinary dashboard, copy these values:
   - Cloud name
   - API key
   - API secret
### ✅ STEP 2: Backend Setup (Node.js + Express + TypeScript)
```bash
npm install cloudinary multer multer-storage-cloudinary dotenv
npm install --save-dev @types/multer
```
1. Create ``.env``
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
2. ``cloudinary.ts`` (config helper)
```ts
// src/utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'land_ads',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 800, height: 600, crop: 'limit' }],
      // You can set public_id dynamically if you want:
      // public_id: 'my_custom_id'
    }
  },
})

export { cloudinary, storage }
```
3. ``upload.route.ts``
```ts
// src/routes/upload.route.ts
import express from 'express'
import multer from 'multer'
import { storage } from '../utils/cloudinary'
import { uploadImage } from '../controllers/upload.controller'

const router = express.Router()

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
})

router.post('/uploadimage', upload.single('image'), uploadImage)

export default router
```
4. ```upload.controller.ts```
```ts
import { Request, Response } from 'express'

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const file = req.file as any
    return res.json({
      success: true,
      imageUrl: file.path,
      publicId: file.filename,
      message: 'Image uploaded successfully',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
```
5. Plug into main ``app.ts``
``app.use('/api', uploadRouter)``
![Cloudinary Upload Flow](./public/cloudinaryflow.drawio.png)

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/weerapperuma/LandSale-Project-Express.git
   cd landsale-project-express
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   PORT=5000
   # For MongoDB Atlas (replace with your connection string)
   MONGO_URI=mongodb+srv://admin:securepassword123@cluster0.abcde.mongodb.net/landsale?retryWrites=true&w=majority
   
   # For Local MongoDB
   # MONGO_URI=mongodb://localhost:27017/landsale
   
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development

   # cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   ```

4. **Test Database Connection**
   ```bash
   # Start the server
   npm run dev
   ```
   
   You should see: `✅ MongoDB connected successfully`

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

### 🔧 Database Connection Troubleshooting

#### Common Issues:

1. **Connection Timeout**
   - Check if MongoDB service is running
   - Verify connection string format
   - Ensure network access is allowed (for Atlas)

2. **Authentication Failed**
   - Double-check username and password
   - Ensure user has correct permissions

3. **Network Access Denied (Atlas)**
   - Add your IP address to Network Access
   - Or use "Allow access from anywhere" for development

4. **Local MongoDB Not Starting**
   ```bash
   # On macOS/Linux
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

#### Testing Connection:
```bash
# Test if MongoDB is running locally
mongo --eval "db.runCommand('ping')"
# Should return: { "ok" : 1 }
```

## 📁 Project Structure

```
/server
├── src/
│   ├── config/               # Database connection, environment config
│   │   ├── db.ts
│   │   └── jwt.ts
│   │
│   ├── controllers/          # Route handler logic
│   │   ├── auth.controller.ts
│   │   ├── land.controller.ts
│   │   └── admin.controller.ts
│   │
│   ├── models/               # Mongoose schemas
│   │   ├── User.ts
│   │   ├── LandAd.ts
│   │   └── Wishlist.ts
│   │
│   ├── routes/               # Route definitions
│   │   ├── auth.routes.ts
│   │   ├── land.routes.ts
│   │   └── admin.routes.ts
│   │
│   ├── middleware/           # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── utils/                # Helpers and utilities
│   │   └── generateToken.ts
│   │
│   ├── types/                # TypeScript type definitions
│   │   └── land.d.ts
│   │
│   ├── app.ts                # Express app setup
│   └── server.ts             # Server entry point
│
├── public/                   # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Authentication Flow

![JWT Authentication Flow](./public/JWT%20Authentication%20Flow%20for%20MERN%20Platform.png)

### Step-by-Step Authentication Process

1. **User Registration/Login**
   ```typescript
   POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **Token Generation**
   ```typescript
   // Backend generates JWT token
   const token = jwt.sign(
     { id: user._id, role: user.role }, 
     JWT_SECRET, 
     { expiresIn: "1h" }
   );
   ```

3. **Protected Route Access**
   ```typescript
   // Frontend sends token in header
   GET /api/lands/my-ads
   Authorization: Bearer <token>
   ```

4. **Middleware Verification**
   ```typescript
   // Backend verifies token
   const decoded = jwt.verify(token, JWT_SECRET);
   req.user = decoded; // { id: ..., role: ... }
   ```

### Role-Based Access Control

| Action                   | Guest | Buyer | Seller | Admin |
| ------------------------ | ----- | ----- | ------ | ----- |
| View ads                 | ✅     | ✅     | ✅      | ✅     |
| Add to wishlist          | ❌     | ✅     | ✅      | ✅     |
| View contact info        | ❌     | ✅     | ✅      | ✅     |
| Post/manage ads          | ❌     | ❌     | ✅      | ✅     |
| Admin dashboard          | ❌     | ❌     | ❌      | ✅     |
| Delete users/ads         | ❌     | ❌     | ❌      | ✅     |

## 🗄️ Database Schema

![ER Diagram](./public/landsellEr.drawio.png)

### Core Models

#### User Model
```typescript
interface User {
  _id: ObjectId;
  email: string;
  password: string;
  role: 'buyer' | 'seller' | 'admin';
  name: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### LandAd Model
```typescript
interface LandAd {
  _id: ObjectId;
  title: string;
  description: string;
  price: number;
  location: {
    district: string;
    city: string;
    address: string;
  };
  size: number; // in square feet
  images: string[];
  seller: ObjectId; // Reference to User
  status: 'active' | 'sold' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Wishlist Model
```typescript
interface Wishlist {
  _id: ObjectId;
  user: ObjectId; // Reference to User
  landAd: ObjectId; // Reference to LandAd
  createdAt: Date;
}
```

## 🔄 Overall Project Flow

![End-to-End Flow](./public/end-end-compocual-flow.png)

```
Frontend (React + TypeScript)
   ⇅
API Calls (Axios/Fetch)
   ⇅
Backend (Express + TypeScript + MongoDB)
   ⇅
JWT Auth + Role Middleware + DB Models
```

## 📊 Development Phases

### ✅ Phase 1: Foundation
- [x] Express + TypeScript setup
- [x] MongoDB connection and schemas
- [x] Basic authentication with JWT
- [x] User registration and login

### ✅ Phase 2: Core Features
- [x] Land advertisement CRUD operations
- [x] Public ad browsing with filters
- [x] Wishlist functionality
- [x] User dashboard

### ✅ Phase 3: Advanced Features
- [x] Role-based access control
- [x] Admin dashboard
- [x] User and ad moderation
- [x] Analytics and reporting

### 🔄 Phase 4: Enhancement
- [ ] Email notifications
- [ ] Image upload with Cloudinary
- [ ] Advanced search and filters
- [ ] Mobile responsiveness

## 🧩 Functional Modules

| Module                             | Description                                  | Status |
| ---------------------------------- | -------------------------------------------- | ------ |
| **User Management**                | CRUD operations, role handling, login/signup | ✅     |
| **Ad Management**                  | Post, update, delete ads, filter/search      | ✅     |
| **Authentication & Authorization** | JWT + Role-based access                      | ✅     |
| **Wishlist**                       | Save/view/remove favorite land ads           | ✅     |
| **Admin Dashboard**                | Manage users/ads, view analytics             | ✅     |
| **Notifications**                  | Email on ad post/successful contact          | 🔄     |

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Land Management
- `GET /api/lands` - Get all land ads (with filters)
- `POST /api/lands` - Create new land ad
- `GET /api/lands/:id` - Get specific land ad
- `PUT /api/lands/:id` - Update land ad
- `DELETE /api/lands/:id` - Delete land ad

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/my-ads` - Get user's ads

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/:landId` - Add to wishlist
- `DELETE /api/wishlist/:landId` - Remove from wishlist

### Admin (Protected)
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/ads` - Get all ads for moderation
- `PUT /api/admin/ads/:id/approve` - Approve ad

## 🚨 Error Handling

The application implements comprehensive error handling:

- **Validation Errors**: Input validation using Joi/Yup
- **Authentication Errors**: JWT verification and role checking
- **Database Errors**: MongoDB connection and query errors
- **File Upload Errors**: Image upload validation and processing

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure authentication with expiration
- **Input Validation**: Request body and parameter validation
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: API rate limiting for abuse prevention
- **Helmet**: Security headers for Express.js

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://your-mongodb-uri
JWT_SECRET=your-secure-jwt-secret
CLOUDINARY_URL=your-cloudinary-url
EMAIL_SERVICE=your-email-service-config
```

### Build and Deploy
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using Express.js, TypeScript, and MongoDB**
