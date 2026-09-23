# Daddy Soda House - Franchise Management Portal (Frontend)

Centralized franchise operations, telemetry, and management portal for **Daddy Soda House**. Built using React 18+, Vite, TypeScript, and Tailwind CSS.

---

## Technology Stack

- **Framework**: [React 18+](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with fresh soda-inspired deep teal/green palette
- **Routing**: [React Router DOM v6](https://reactrouter.com/) (Role-based Protected Routing)
- **State & Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **HTTP Client**: [Axios](https://axios-http.com/) with bearer token injection and global 401 interception
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)

---

## Prerequisites

- **Node.js**: `v18.x`, `v20.x`, or `v22+` / `v26+`
- **npm**: `v9+` or `v10+`
- **Backend API**: Spring Boot REST API must be running locally on port **8080** with base URL `http://localhost:8080/api/v1`.

---

## Getting Started

### 1. Clone the repository & Navigate to project directory
```bash
cd Daddy_Soda_FE
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment configuration file:
```bash
cp .env.example .env
```
Ensure `.env` contains:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

> [!NOTE]
> Backend REST API must be running locally at `http://localhost:8080`.

### 4. Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server on port 3000 |
| `npm run build` | Compiles TypeScript and builds production assets in `dist/` |
| `npm run preview` | Previews production build locally |
| `npm test` | Executes Vitest test suite in single-run mode |
| `npm run test:watch` | Starts Vitest interactive watch mode |

---

## Role-Based Access Control

The portal strictly segregates user experiences based on backend roles:

| Role | Default Landing | Accessible Routes & Modules |
| :--- | :--- | :--- |
| `SUPER_ADMIN` | `/dashboard` | Operational Dashboard, Masters (Franchises, Outlets, Machines, Products, Suppliers), Purchases, Inventory, Orders, Invoices, Dues, Reports, Enquiries, IoT, Manual Daily Sales |
| `MANAGER` | `/dashboard` | Same operational modules as Super Admin (excluding user management) |
| `FRANCHISE_OWNER` | `/my-dashboard` | My Dashboard, My Machines, My Orders, My Invoices, My Due Payments, My Monthly Reports, Manual Daily Sales |

> [!CAUTION]
> If a `FRANCHISE_OWNER` attempts to access admin routes (e.g., `/dashboard` or `/franchises`), they are blocked and directed to `/unauthorized` (HTTP 403 Access Denied).
> Unauthenticated users accessing any protected route are redirected to `/login`.

---

## Backend Integration Details

### Available Endpoints
- `POST /api/v1/auth/login` - User login with `{ mobile, password }`
- `GET /api/v1/auth/me` - Validates current token and returns active session user profile
- `POST /api/v1/auth/logout` - Logs out the active session
- `GET /api/v1/public/status` - Checks whether backend server is reachable ("System online")

### Response Format
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "timestamp": "2026-09-23T10:00:00Z"
}
```

---

## Folder Structure

```
src/
├── api/                  # Axios instance, interceptors, error parsers, and API calls
├── components/
│   ├── common/           # Common components (Breadcrumb, PageHeader, ErrorMessage, etc.)
│   └── ui/               # Reusable primitive UI components (Button, Input, Card, Modal, Table, etc.)
├── config/               # Environment configuration and navigation menu definitions
├── contexts/             # AuthContext and ToastContext providers
├── hooks/                # Custom hooks (useAuth, useToast)
├── layouts/              # DashboardLayout, responsive Sidebar, and Header
├── pages/
│   ├── auth/             # LoginPage
│   ├── common/           # UnauthorizedPage, NotFoundPage, ModulePlaceholderPage
│   └── dashboard/        # AdminDashboardPage (/dashboard) & FranchiseDashboardPage (/my-dashboard)
├── routes/               # AppRoutes, ProtectedRoute guard, RoleRoute guard
├── types/                # TypeScript interfaces (auth, api, navigation)
└── utils/                # Utility helpers (cn, storage)
```

---

## Running Automated Tests

```bash
npm test
```
Vitest validates:
- Unauthenticated user redirects to login
- Successful login redirects by role (`SUPER_ADMIN` -> `/dashboard`, `FRANCHISE_OWNER` -> `/my-dashboard`)
- Invalid login displays backend error message cleanly
- Protected route blocks unauthenticated user
- Franchise Owner cannot access admin routes (shows `/unauthorized`)
- Logout clears session tokens and returns user to `/login`
