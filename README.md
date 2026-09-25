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
| `SUPER_ADMIN` | `/dashboard` | Operational Dashboard, Master Data (Franchises, Outlets, Machines, Products, Suppliers, User Logins), Purchases, Inventory, Orders, Invoices, Dues, Reports, Enquiries, IoT, Manual Daily Sales |
| `MANAGER` | `/dashboard` | Same operational modules as Super Admin (excluding User Logins management `/users`) |
| `FRANCHISE_OWNER` | `/my-dashboard` | My Dashboard (with Compact Franchise Card & Outlets), My Machines (`/my-machines`), My Orders, My Invoices, My Due Payments, My Monthly Reports, Manual Daily Sales |

> [!CAUTION]
> If a `FRANCHISE_OWNER` attempts to access admin routes (e.g., `/dashboard`, `/franchises`, `/outlets`, `/machines`, `/products`, `/suppliers`, `/users`), they are blocked and directed to `/unauthorized` (HTTP 403 Access Denied).
> Unauthenticated users accessing any protected route are redirected to `/login`.

---

## Master Data Module (FE-02)

The Master Data module provides full lifecycle management (Create, Read, Update, Status Toggle) for core operational entities.

### Entity Creation Dependency Order
Due to relational constraints, entities must be provisioned in the following order:
1. **Franchise** (`/franchises`): Create and activate the Franchise entity first.
2. **Outlet** (`/outlets`): Requires an **active Franchise** to be selected.
3. **Machine** (`/machines`): Cascading selection requires choosing a Franchise first to view its **active Outlets**, and then assigning the Machine to an Outlet. Includes optional IoT Device ID and display-only Last Telemetry timestamp.
4. **Flavours / Products** (`/products`): Independent catalog. Defaults bottle size to **5.00 L** and formats unit prices in currency (`₹ 0.00`).
5. **Suppliers** (`/suppliers`): Independent catalog. Includes optional 15-character GSTIN format validation.

### Franchise Owner User Creation Workflow
1. Navigate to **Masters > Franchises** (`/franchises`) and create the franchise record (e.g., "Downtown Express").
2. Navigate to **Masters > User Logins** (`/users`) *(Super Admin only)*.
3. Click **Add User**, set Role to `FRANCHISE_OWNER`.
4. The **Assigned Franchise** dropdown will dynamically appear and become mandatory. Select the newly created franchise.
5. Provide the mobile number (10 digits), full name, email, and a temporary password (min 6 characters).
6. The Franchise Owner can now log in via `/login` and is automatically redirected to `/my-dashboard` with isolated access to their franchise telemetry, outlets, and machines (`/my-machines`).

---

## Backend Integration Details

### Authentication Endpoints
- `POST /api/v1/auth/login` - User login with `{ mobile, password }`
- `GET /api/v1/auth/me` - Validates current token and returns active session user profile
- `POST /api/v1/auth/logout` - Logs out the active session
- `GET /api/v1/public/status` - Checks whether backend server is reachable ("System online")

### Master Data Endpoints
- **Franchises**: `POST/GET /franchises`, `GET/PUT /franchises/{id}`, `PATCH /franchises/{id}/status`
- **Outlets**: `POST/GET /outlets`, `GET/PUT /outlets/{id}`, `PATCH /outlets/{id}/status`
- **Machines**: `POST/GET /machines`, `GET/PUT /machines/{id}`, `PATCH /machines/{id}/status`
- **Products**: `POST/GET /products`, `GET/PUT /products/{id}`, `PATCH /products/{id}/status`
- **Suppliers**: `POST/GET /suppliers`, `GET/PUT /suppliers/{id}`, `PATCH /suppliers/{id}/status`
- **User Logins** *(Super Admin)*: `POST/GET /users`, `PATCH /users/{id}/status`
- **Franchise Self-Service**: `GET /my/machines`, `GET /my/franchise`, `GET /my/outlets`

### Standard Response Format
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
├── api/                  # Axios instance, interceptors, error parsers, and typed API clients (auth, master)
├── components/
│   ├── common/           # Common components (Breadcrumb, PageHeader, ErrorMessage, TableSkeleton, etc.)
│   └── ui/               # Reusable primitive UI components (Button, Input, Select, Card, Modal, Table, etc.)
├── config/               # Environment configuration and navigation menu definitions
├── contexts/             # AuthContext and ToastContext providers
├── hooks/                # Custom hooks (useAuth, useToast, useMasterData)
├── layouts/              # DashboardLayout, responsive Sidebar, and Header
├── pages/
│   ├── auth/             # LoginPage
│   ├── common/           # UnauthorizedPage, NotFoundPage, ModulePlaceholderPage
│   ├── dashboard/        # AdminDashboardPage (/dashboard) & FranchiseDashboardPage (/my-dashboard)
│   ├── franchise/        # Franchise Owner self-service pages (MyMachinesPage)
│   └── masters/          # Master CRUD pages (Franchises, Outlets, Machines, Products, Suppliers, Users)
├── routes/               # AppRoutes, ProtectedRoute guard, RoleRoute guard
├── types/                # TypeScript interfaces (auth, api, master, navigation)
└── utils/                # Utility helpers (cn, storage, formatters)
```

---

## Running Automated Tests

```bash
npm test
```
Vitest validates:
- **Authentication & Role-Based Routing**:
  - Unauthenticated user redirects to login
  - Successful login redirects by role (`SUPER_ADMIN` / `MANAGER` -> `/dashboard`, `FRANCHISE_OWNER` -> `/my-dashboard`)
  - Invalid login displays backend error message cleanly
  - Protected route blocks unauthenticated user
  - Franchise Owner cannot access admin routes (shows `/unauthorized`)
  - Logout clears session tokens and returns user to `/login`
- **Master Data Module**:
  - `MANAGER` can access operational masters (`/franchises`, `/outlets`, `/products`)
  - `FRANCHISE_OWNER` is blocked from `/franchises` and redirected to `/unauthorized`
  - Validates required fields and 10-digit mobile in Franchise form
  - Defaults bottle size to 5.00 L in Product form
  - Requires franchise selection when creating a `FRANCHISE_OWNER` user
  - Hides franchise selection when creating a `MANAGER` user
  - Disables machine outlet selector until a franchise is selected (cascading dependency)
  - Requires confirmation modal before toggling entity active status
  - Calls create API and invalidates TanStack Query cache on successful form submission
