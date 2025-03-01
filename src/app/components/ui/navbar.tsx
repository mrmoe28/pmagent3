"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Tasks", href: "/tasks" },
];

export function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div
                className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center mr-3"
              >
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                PmAgent<span className="text-orange-500">3</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden sm:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <span className={cn(
                    "relative z-10",
                    isActive 
                      ? "text-white" 
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  )}>
                    {item.name}
                  </span>
                  
                  {isActive && (
                    <div
                      className="absolute inset-0 bg-orange-500 rounded-md"
                    />
                  )}
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none"
            >
              <span className="sr-only">View notifications</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            
            <div className="ml-3">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300"
              >
                <span className="font-medium text-sm">EH</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 