import type { Metadata } from 'next';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

export const metadata: Metadata = {
  title: 'Infynia Labs',
  description: 'Pioneering the future of intelligence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-background text-foreground antialiased">
        <AuthProvider>
          <div className="gradient-orb absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full pointer-events-none"></div>
          <div className="gradient-orb absolute top-1/3 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none"></div>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
