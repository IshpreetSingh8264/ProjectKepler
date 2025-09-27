import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import { AppLoadingBoundary } from "@/components/common";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AuthProvider>
          <AppLoadingBoundary name="application">
            {children}
          </AppLoadingBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
