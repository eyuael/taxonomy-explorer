// app/layout.tsx
"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from 'react';



const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
        {/* Navigation Header */}
          <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
            <nav className="container mx-auto px-4 h-full flex items-center justify-between">
              <h1 className="text-xl font-bold">Mammal Taxonomy Explorer</h1>
            </nav>
          </header>

          {/* Main Content Area */}
          <main className="pt-16 min-h-screen">
            {children}
          </main>
        </QueryClientProvider>
      </body>
    </html>
  );
}

