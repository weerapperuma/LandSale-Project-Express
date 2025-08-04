## 1. Core Use Case Overview
### Roles:
- Guest: Browse land listings.

- Buyer (Logged-In User): Save to wishlist, view contact info, contact seller.

- Seller (Logged-In User): Post/manage ads.

- Admin: Manage users, ads, and other admins.

### Key Features:
- View land ads with filters (district, city, price, etc.)

- Wishlist and save favorites (requires login)

- Create/Edit/Delete own ads (sellers)

- Admin dashboard: user and ad control, analytics

- Email confirmation on successful ad submission (optional)

## 2. ER Diagram (Simplified)

![ER Diagram](./public/landsellEr.drawio.png)

## 🔐 3. Authentication & Authorization (JWT Flow)
### Signup/Login Flow:
- User signs up or logs in with email/password.

- Server generates JWT token with role, user ID, and expiration.

- Token is sent to frontend and stored (usually in localStorage or HTTP-only cookie).

- For each request (create ad, view phone, etc.), frontend sends token via header.

- Middleware verifies token and extracts user info.

### Role-Based Access:
- buyer/seller: Can access user dashboard, ads, wishlist.

- admin: Can access /admin routes, delete users/ads, promote users.

## 🗂️ 4. Project Folder Structure
```bash
/server
  /src
    /controllers
      - authController.ts
      - landController.ts
      - adminController.ts
    /models
      - User.ts
      - LandAd.ts
      - Wishlist.ts
    /routes
      - authRoutes.ts
      - landRoutes.ts
      - userRoutes.ts
      - adminRoutes.ts
    /middleware
      - authMiddleware.ts
      - roleMiddleware.ts
    /utils
      - jwt.ts
      - mailer.ts (if using SendGrid/Nodemailer)
    /config
      - db.ts
      - env.ts
    server.ts
  package.json
  tsconfig.json

```
## 📊 5. Dashboard Views
### Buyer/Seller Dashboard
- My Ads
- Favorite Ads
- Analytics (views, responses on ads)
### Admin Dashboard
- All Users (Delete, Promote to Admin)
- All Ads (Approve/Delete)
- System Analytics (Total Ads, Active Users)
## 🔁 6. Project Flow & Development Phases
### ✅ Phase 1: Setup
- Initialize MERN boilerplate
- Setup MongoDB schema & connection
- Create User/Auth logic with JWT
### ✅ Phase 2: Core Features
- Public ad browsing
- Signup/Login
- Posting & viewing ads
- Wishlist/favorites logic
### ✅ Phase 3: Admin & Role Logic
- Admin dashboard
- Role-based routes & token auth middleware
- Soft delete features for moderation
### ✅ Phase 4: Polish & Extend
- Optional email confirmation (Nodemailer/SendGrid)
- Analytics view
- Media uploads (Cloudinary/S3/local)
## 7. Functional Modules (To Match Coursework)
| Module                             | Description                                  |
| ---------------------------------- | -------------------------------------------- |
| **User Management**                | CRUD operations, role handling, login/signup |
| **Ad Management**                  | Post, update, delete ads, filter/search      |
| **Authentication & Authorization** | JWT + Role-based access                      |
| **Wishlist**                       | Save/view/remove favorite land ads           |
| **Admin Dashboard**                | Manage users/ads, view analytics             |
| **(Optional) Notifications**       | Email on ad post/successful contact          |
