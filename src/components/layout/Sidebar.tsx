import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import {
  Users,
  MessageSquare,
  Shield,
  BarChart,
  Settings,
  Link,
  Code
} from 'lucide-react';

const navigation = [
  {
    name: 'Customer Segmentation',
    href: '/segments',
    icon: Users
  },
  {
    name: 'Automated Communication',
    href: '/communication',
    icon: MessageSquare
  },
  {
    name: 'Proactive Management',
    href: '/management',
    icon: Shield
  },
  {
    name: 'Business Intelligence',
    href: '/intelligence',
    icon: BarChart
  },
  {
    name: 'Feedback Loop Settings',
    href: '/feedback',
    icon: Settings
  },
  {
    name: 'System Integrations',
    href: '/integrations',
    icon: Link
  },
  {
    name: 'Code Health',
    href: '/code-health',
    icon: Code
  }
];

export const Sidebar: FC = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-xl font-semibold">AI Fleet Manager</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = router.pathname.startsWith(item.href);
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5',
                  isActive ? 'text-gray-500' : 'text-gray-400'
                )}
              />
              {item.name}
            </a>
          );
        })}
      </nav>
    </div>
  );
}; 