
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Menu, X, LogOut, Settings, Home, ShoppingCart, DollarSign, Users, BarChart3, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ROLE_LABELS } from '@/constants/roles';
import { getUserRoleFromRoleType } from '@/lib/role-utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  leftPanel?: React.ReactNode;
  showLeftPanel?: boolean;
}

export function MainLayout({ children, leftPanel, showLeftPanel = true }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const userRole = user?.role_type ? getUserRoleFromRoleType(user.role_type) : 'mesero';
  const roleLabel = ROLE_LABELS[userRole] || 'Usuario';

  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  const menuItems = [
    { href: '/inicio', label: 'INICIO', icon: Home, roles: ['mesero', 'cajero', 'chef', 'ayudante', 'admin'] },
    { href: '/pedidos', label: 'PEDIDOS', icon: ShoppingCart, roles: ['mesero', 'cajero', 'chef', 'ayudante', 'admin'] },
    { href: '/pagados', label: 'PAGADOS', icon: CheckCircle, roles: ['mesero', 'cajero', 'admin'] },
    { href: '/empleados', label: 'EMPLEADOS', icon: Users, roles: ['admin'] },
    { href: '/dashboard', label: 'DASHBOARD', icon: BarChart3, roles: ['mesero', 'cajero', 'chef', 'ayudante', 'admin'] },
    { href: '/ajustes', label: 'AJUSTES', icon: Settings, roles: ['mesero', 'cajero', 'chef', 'ayudante', 'admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            <div className="flex items-center gap-2">
              <img 
                src="/img-header/logo/luwak-logo-main.webp" 
                alt="LUWAK Manager" 
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#4F5A25] text-white'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              CERRAR SESIÓN
            </Button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium">{user?.email || 'Usuario'}</span>
              <span className="text-xs text-muted-foreground">{roleLabel}</span>
            </div>
            <Avatar className="h-10 w-10 border-2 border-[#4F5A25]/20">
              <AvatarImage src="/img-usuarios/default/default-avatar.webp" />
              <AvatarFallback className="bg-[#4F5A25] text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-card border-r transition-transform duration-300 ease-in-out lg:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <img 
              src="/img-header/logo/luwak-logo-main.webp" 
              alt="LUWAK Manager" 
              className="h-8 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#4F5A25] text-white'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
            >
              <LogOut className="h-5 w-5" />
              CERRAR SESIÓN
            </Button>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {showLeftPanel && leftPanel && (
            <div className="lg:col-span-4">
              {leftPanel}
            </div>
          )}
          <div className={showLeftPanel ? 'lg:col-span-8' : 'lg:col-span-12'}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
