# Prima Dashboard

A modern, comprehensive B2B dashboard for hotel and venue partners built with Next.js 15, React 19, and shadcn/ui. This dashboard provides partners with a single control plane to drive revenue, manage distribution, and maintain financial transparency.

## 🚀 Live Demo

- **Production**: [prima-dashboard.vercel.app](https://prima-dashboard.vercel.app)
- **Staging**: Available via Vercel dashboard

## ✨ Features

### Core Modules
- **📊 Overview** - KPI dashboard with real-time metrics and drill-through capabilities
- **📅 Bookings** - Comprehensive booking management with status controls and filtering
- **💰 Pricing** - Prime/Non-Prime pricing configuration with live calculations
- **👥 Promoters** - Leaderboard, performance tracking, and commission management
- **🎯 Incentives** - Create and manage promoter incentive programs
- **💸 Commissions** - Tiered commission structure and assignment management
- **📈 Finance** - Financial overview, payout management, and transaction tracking
- **👤 Team** - Role-based access control and user management
- **⚙️ Settings** - Theme management and configuration

### Technical Features
- **🔐 Authentication** - Secure login with protected routes
- **📱 Responsive Design** - Mobile-first approach with Tailwind CSS
- **🎨 Modern UI** - Built with shadcn/ui components
- **🔄 State Management** - Redux Toolkit with RTK Query
- **🧪 Mock API** - MSW (Mock Service Worker) for development
- **📊 Data Visualization** - Charts and metrics with Recharts
- **🌙 Dark Mode** - Theme switching support
- **♿ Accessibility** - WCAG compliant components

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **State Management**: Redux Toolkit + RTK Query
- **API Mocking**: MSW (Mock Service Worker)
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React, Radix UI Icons
- **Linting**: ESLint v9
- **Formatting**: Prettier

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adamtday/prima-dashboard.git
   cd prima-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint errors
pnpm format       # Check Prettier formatting
pnpm format:fix   # Fix Prettier formatting

# Deployment
pnpm deploy:staging     # Deploy to staging
pnpm deploy:production  # Deploy to production
pnpm deploy:preview     # Deploy preview
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Architecture](./docs/architecture/)** - Technical architecture and patterns
- **[Modules](./docs/modules/)** - Detailed module specifications
- **[Data Models](./docs/data/)** - API contracts and mock data
- **[Development](./docs/development/)** - Development guides and workflows
- **[Design System](./docs/design/)** - Design tokens and theming
- **[Testing](./docs/testing/)** - Testing strategies and QA guidelines
- **[Deployment](./DEPLOYMENT.md)** - Deployment guide and CI/CD setup

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main dashboard pages
│   ├── (prima)/          # Prima-specific modules
│   └── api/              # API routes
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── prima/            # Prima-specific components
├── lib/                  # Utilities and configurations
│   ├── auth/             # Authentication logic
│   └── store/            # Redux store
├── mocks/                # MSW mock data and handlers
└── types/                # TypeScript type definitions
```

## 🚀 Deployment

This project is configured for automatic deployment via Vercel:

- **Production**: Deploys automatically from `main` branch
- **Staging**: Deploys automatically from `staging` branch

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component library
- [Vercel](https://vercel.com/) for hosting and deployment
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the React framework
