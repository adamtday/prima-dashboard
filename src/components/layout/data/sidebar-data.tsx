import {
  IconApps,
  IconBarrierBlock,
  IconBug,
  IconChecklist,
  IconCode,
  IconCoin,
  IconError404,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconNotification,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUser,
  IconUserOff,
  IconUsers,
} from "@tabler/icons-react"
import { 
  AudioWaveform, 
  GalleryVerticalEnd,
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  Gift,
  Trophy,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { type SidebarData } from "../types"

export const sidebarData: SidebarData = {
  user: {
    name: "ausrobdev",
    email: "rob@shadcnblocks.com",
    avatar: "/avatars/ausrobdev-avatar.png",
  },
  teams: [
    {
      name: "Shadcnblocks - Admin Kit",
      logo: ({ className }: { className: string }) => (
        <Logo className={cn("invert dark:invert-0", className)} />
      ),
      plan: "Nextjs + shadcn/ui",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          icon: IconLayoutDashboard,
          items: [
            {
              title: "Dashboard 1",
              url: "/",
            },
            {
              title: "Dashboard 2",
              url: "/dashboard-2",
            },
            {
              title: "Dashboard 3",
              url: "/dashboard-3",
            },
          ],
        },
        {
          title: "Tasks",
          url: "/tasks",
          icon: IconChecklist,
        },
        {
          title: "Users",
          url: "/users",
          icon: IconUsers,
        },
      ],
    },
    {
      title: "Pages",
      items: [
        {
          title: "Auth",
          icon: IconLockAccess,
          items: [
            {
              title: "Login",
              url: "/login",
            },
            {
              title: "Register",
              url: "/register",
            },
            {
              title: "Forgot Password",
              url: "/forgot-password",
            },
          ],
        },
        {
          title: "Errors",
          icon: IconBug,
          items: [
            {
              title: "Unauthorized",
              url: "/401",
              icon: IconLock,
            },
            {
              title: "Forbidden",
              url: "/403",
              icon: IconUserOff,
            },
            {
              title: "Not Found",
              url: "/404",
              icon: IconError404,
            },
            {
              title: "Internal Server Error",
              url: "/error",
              icon: IconServerOff,
            },
            {
              title: "Maintenance Error",
              url: "/503",
              icon: IconBarrierBlock,
            },
          ],
        },
      ],
    },
    {
      title: "PRIMA Partner",
      items: [
        {
          title: "Overview",
          url: "/overview",
          icon: BarChart3,
          description: "Dashboard and key metrics"
        },
        {
          title: "Bookings",
          url: "/bookings", 
          icon: Calendar,
          description: "Manage reservations"
        },
        {
          title: "Pricing",
          url: "/pricing",
          icon: DollarSign,
          description: "Configure pricing rules"
        },
        {
          title: "Promoters",
          url: "/promoters",
          icon: Users,
          description: "Manage promoter network"
        },
        {
          title: "Finance",
          url: "/finance",
          icon: CreditCard,
          description: "Payments and payouts"
        },
        {
          title: "Incentives",
          url: "/incentives",
          icon: Gift,
          description: "Promoter incentive programs"
        },
        {
          title: "Commissions",
          url: "/commissions",
          icon: Trophy,
          description: "Commission structure"
        },
        {
          title: "Team",
          url: "/team",
          icon: Users,
          description: "Team & access control"
        },
        {
          title: "Settings",
          url: "/settings",
          icon: IconSettings,
          description: "PRIMA configuration"
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          icon: IconSettings,
          items: [
            {
              title: "General",
              icon: IconTool,
              url: "/settings",
            },
            {
              title: "Profile",
              icon: IconUser,
              url: "/settings/profile",
            },
            {
              title: "Billing",
              icon: IconCoin,
              url: "/settings/billing",
            },
            {
              title: "Plans",
              icon: IconChecklist,
              url: "/settings/plans",
            },
            {
              title: "Connected Apps",
              icon: IconApps,
              url: "/settings/connected-apps",
            },
            {
              title: "Notifications",
              icon: IconNotification,
              url: "/settings/notifications",
            },
          ],
        },
        {
          title: "Developers",
          icon: IconCode,
          items: [
            {
              title: "Overview",
              url: "/developers/overview",
            },
            {
              title: "API Keys",
              url: "/developers/api-keys",
            },
            {
              title: "Webhooks",
              url: "/developers/webhooks",
            },
            {
              title: "Events/Logs",
              url: "/developers/events-&-logs",
            },
          ],
        },
      ],
    },
  ],
}
