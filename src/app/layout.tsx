import './globals.css';
import type { Metadata } from 'next';

// This function runs during the build process and when the app starts
export async function generateStaticParams() {
  // Don't access database during build
  return [];
}

// This runs when the app starts
export const dynamic = 'force-dynamic';

// This ensures the data is seeded when the app initializes
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'مطعمنا المميز',
    description: 'قائمة مطعم شرقية أصيلة',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

// Disable static generation to avoid hydration issues
export const dynamicParams = false;
export const revalidate = 0;