# TeamFlow 🚀

TeamFlow is a modern, full-stack, role-based task and project management application designed to help teams collaborate effectively. It features visual Kanban boards, comprehensive real-time dashboards, and strict Role-Based Access Control (RBAC).

## ✨ Features

- **Modern UI/UX**: Built with a visually stunning, responsive interface featuring gradients and dynamic micro-animations.
- **Kanban Boards**: Drag-friendly (visual) task organization with To Do, In Progress, and Done columns.
- **Role-Based Access Control (RBAC)**: 
  - **Admins** have full control: they can create projects, manage tasks, assign team members, and approve/reject new admin requests.
  - **Members** focus on their work: they can only update the status of tasks assigned specifically to them.
- **Admin Approval Workflow**: New users requesting Admin privileges are placed in a "Pending" state until an existing Admin approves them.
- **Live Dashboards**: Interactive charts built with Recharts to visualize task distribution, priority breakdown, and team performance.
- **Centralized User Directory**: An easy-to-use directory for admins to view joined users and quickly copy emails for project invites.

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS v4
- Zustand (State Management)
- React Router v7
- Recharts (Data Visualization)

**Backend:**
- Node.js
- Express 5
- Prisma ORM
- PostgreSQL (hosted via Supabase)
- JSON Web Tokens (JWT) & bcrypt (Authentication/Security)
- Zod (Validation)

---

## 💻 Local Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) database (or a cloud DB like [Supabase](https://supabase.com/))

### 2. Clone the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/teamflow-app.git
cd teamflow-app
```

### 3. Install Dependencies
The project uses a root `package.json` to manage both backend and frontend environments.
```bash
npm run install:all
```

### 4. Configure Environment Variables
Create a `.env` file inside the `backend/` directory:
```bash
# backend/.env

# Your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/teamflow"

# Secret key for JWT authentication
JWT_SECRET="your-super-secret-development-key"

# Backend Port
PORT=5000
```

### 5. Setup the Database
Generate the Prisma client and push the schema to your database:
```bash
npm run db:generate
npm run db:push
```

*(Optional)* Seed the database with demo accounts (Admin: `admin` / `admin123`, User: `alice@example.com` / `admin123`):
```bash
npm run db:seed
```

### 6. Run the Application locally
Start both the backend and frontend development servers concurrently:
```bash
npm run dev
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## ☁️ Deployment (Railway)

The application is configured to be easily deployed as a single unified service on [Railway](https://railway.app/). The backend will serve the built frontend static files in production.

### Step 1: Push to GitHub
Ensure all your code is pushed to a public or private GitHub repository.

### Step 2: Deploy on Railway
1. Log into your [Railway](https://railway.app/) dashboard.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository.
4. Railway will recognize the `railway.toml` and root `package.json` files and begin the build process.

### Step 3: Add Environment Variables in Railway
1. Go to your Railway project dashboard and select your service.
2. Navigate to the **Variables** tab.
3. Add the following variables:
   - `DATABASE_URL`: Your production PostgreSQL connection string (e.g., from Supabase).
   - `JWT_SECRET`: A strong, random string for signing tokens.
   - `NODE_ENV`: `production`

### Step 4: Expose the Application
1. Go to the **Settings** tab of your service.
2. Scroll to the **Networking** section.
3. Click **Generate Domain**.

Railway will automatically redeploy with the new environment variables and domain. Once finished, your full-stack TeamFlow application will be live and accessible to the public!
