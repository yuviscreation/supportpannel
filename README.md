# Enterprise Support Request System

A modern, modular enterprise-grade Help Center and Support Request Management System built with Next.js 14, TypeScript, and clean architecture principles.

## 🎯 Features

- **Help Center Landing Page** - Professional UI with support categories
- **Multiple Support Request Types**:
  - IT Admin / Data Correction Requests
  - Change / Enhancement Requests
  - Bug Reports
  - Feature Requests
- **Admin Dashboard** - View and manage tickets with real-time status updates
- **Modular Architecture** - Feature-based folder structure
- **Lazy Loading** - Optimized performance with code splitting
- **Error Boundaries** - Professional error handling
- **Type-Safe** - Full TypeScript support with strict mode
- **Responsive Design** - Mobile-first design approach

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router with Server & Client Components)
- **TypeScript** (Strict mode)
- **Tailwind CSS** (Utility-first styling)
- **Lucide Icons** (Modern icon library)
- **Dynamic Imports** (Code splitting & lazy loading)

### Architecture
- **Feature-Based Structure** - Organized by domain, not by type
- **Service Layer** - Centralized API calls with error handling
- **Custom Hooks** - Reusable business logic
- **Shared Components** - DRY principle applied
- **Constants Management** - Configuration over magic strings

## 📁 Project Structure

```
supportpannel/
├── app/                          # Next.js App Router
│   ├── help-center/              # Help center landing page
│   ├── support/                  # Support request pages
│   │   ├── it-admin-category/
│   │   ├── enhancement-category/
│   │   ├── it-admin/
│   │   └── enhancement/
│   ├── admin/                    # Admin dashboard
│   │   └── support/
│   ├── api/                      # API routes
│   │   └── admin/support/        # Ticket management API (mock)
│   ├── globals.css
│   └── layout.tsx
│
├── src/                          # Modular source code
│   ├── features/                 # Feature modules
│   │   ├── tickets/              # Ticket management feature
│   │   │   ├── components/       # UI components
│   │   │   ├── hooks/            # Custom hooks (useTickets)
│   │   │   ├── services/         # API service layer
│   │   │   └── index.ts
│   │   └── help-center/          # Help center feature
│   │       ├── components/
│   │       └── index.ts
│   │
│   └── shared/                   # Shared resources
│       ├── components/           # Reusable components
│       │   ├── ErrorBoundary.tsx
│       │   ├── ErrorAlert.tsx
│       │   ├── LoadingSpinner.tsx
│       │   └── EmptyState.tsx
│       ├── constants/            # Configuration
│       │   ├── support.ts        # Ticket constants
│       │   └── images.ts         # Asset paths
│       ├── hooks/                # Generic hooks
│       │   └── use-async-operation.ts
│       ├── types/                # TypeScript types
│       │   └── support.ts
│       └── utils/                # Utilities
│           ├── api-client.ts     # HTTP client
│           ├── cn.ts             # Tailwind merger
│           └── format.ts         # Formatters
│
├── components/                   # UI component library
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Table.tsx
│   │   └── Badge.tsx
│   ├── Header.tsx
│   └── Footer.tsx
│
├── public/                       # Static assets
│   ├── images/
│   └── animations/
│
└── package.json
```

## 🛠️ Installation

### 1. Clone and Install

```bash
git clone <repository-url>
cd supportpannel
npm install
```

### 2. Environment Setup

Create `.env.local` file (optional - currently using mock data):

```env
# Future: Add database connection
# DATABASE_URL=your_database_url
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## 📖 Usage

### Main Routes

- `/help-center` - Main help center page
- `/admin/support` - Admin dashboard (mock data)
- `/support/it-admin-category` - IT Admin requests
- `/support/enhancement-category` - Enhancement requests

### API Routes

- `GET /api/admin/support` - Fetch all tickets
- `PATCH /api/admin/support` - Update ticket status
- `POST /api/admin/support` - Create new ticket

**Note:** Currently using in-memory mock data. For production, integrate with a database (PostgreSQL, MongoDB, Supabase, etc.)

## 🏗️ Architecture Principles

### Feature-Based Modules
Each feature is self-contained with its own components, hooks, and services:
```
features/tickets/
├── components/     # UI components
├── hooks/          # Business logic
├── services/       # API calls
└── index.ts        # Barrel export
```

### Separation of Concerns
- **UI Layer**: Presentation components
- **Business Logic**: Custom hooks
- **Data Layer**: API services

### Lazy Loading
Heavy components are dynamically imported:
```typescript
const TicketsTable = dynamic(() => import('@/features/tickets'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

### Error Handling
Professional error boundaries and user feedback:
```typescript
<ErrorBoundary>
  {error && <ErrorAlert message={error} />}
  <Component />
</ErrorBoundary>
```

## 🔧 Development

### Import Patterns

```typescript
// Shared utilities
import { cn, formatDate } from '@/shared/utils';

// Shared types
import type { SupportTicket } from '@/shared/types';

// Constants
import { TICKET_STATUS } from '@/shared/constants';

// Components
import { ErrorBoundary } from '@/shared/components';

// Features
import { useTickets } from '@/features/tickets';
```

### Custom Hooks

```typescript
// Ticket management hook
const {
  tickets,
  loading,
  error,
  refetch,
  updateStatus,
  updatingTickets
} = useTickets();
```

## 🚀 Performance Optimizations

- ✅ Server Components by default
- ✅ Client Components only when needed
- ✅ Dynamic imports for heavy components
- ✅ Route-level code splitting
- ✅ Optimized bundle sizes
- ✅ Lazy-loaded animations

## 🗺️ Roadmap

### Backend Integration (Recommended)
Replace mock API with real database:
- [ ] Add Prisma + PostgreSQL
- [ ] Create ticket CRUD operations
- [ ] Add user authentication
- [ ] Implement real-time updates

### Features
- [ ] Ticket filtering and search
- [ ] File upload functionality
- [ ] Email notifications
- [ ] Ticket comments/discussion
- [ ] Analytics dashboard

## 📚 Documentation

- [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md) - Complete refactoring guide
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Create feature branch
2. Follow existing code structure
3. Add types for new features
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - feel free to use for your projects

## 🆘 Support

For issues or questions:
- Check existing documentation
- Review code comments
- Open an issue on GitHub

---

**Built with ❤️ using Next.js, TypeScript, and modern best practices**
