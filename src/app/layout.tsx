import '../index.css';
import { BottomNav } from '@/components/BottomNav';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased pb-16">
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
